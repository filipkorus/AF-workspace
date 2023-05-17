import React, {DragEventHandler, useEffect, useRef, useState} from 'react';
import {
	Box,
	Button, Dialog, DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid, IconButton,
	Paper,
	TextField,
	Typography
} from '@mui/material';
import '../../../styles/DragnDrop.css';
import CONFIG from '../../../config/index';
import {v4 as uuidv4} from 'uuid';
import File from './File';
import {useSocket} from '../../../contexts/SocketContext';
import {IWorkspaceSharedFile} from '../../../types';
import getFileExtension from '../../../utils/getFileExtension';
import {useAuth} from '../../../contexts/AuthContext';
import {Delete as DeleteIcon} from '@mui/icons-material';

const DragnDrop = ({sharedFiles, setSharedFiles}: {
	sharedFiles: IWorkspaceSharedFile[],
	setSharedFiles: React.Dispatch<React.SetStateAction<IWorkspaceSharedFile[]>>
}) => {
	const {currentUser}: any = useAuth();
	const {socket, isConnected, isRoomJoined}: any = useSocket();

	const fileInput = useRef<HTMLInputElement>(null);
	const dropzoneArea = useRef<HTMLInputElement>(null);

	const [isDragOver, setIsDragOver] = useState<boolean>(false);

	const [files, setFiles] = useState<IWorkspaceSharedFile[]>([]);
	const [isUploading, setIsUploading] = useState<boolean>(false);

	const fileListBeginningRef = useRef<HTMLDivElement>(null);

	const [fileToRemove, setFileToRemove] = useState<IWorkspaceSharedFile | null>(null);
	const [openRemoveFileDialog, setOpenRemoveFileDialog] = useState<boolean>(false);

	useEffect(() => {
		if (sharedFiles == null) return;
		setFiles(sharedFiles);
	}, [sharedFiles]);

	const handleFileChange = async (event: any) => {
		const file = event.target.files[0];
		await handleFileValidation(file);
	};

	const handleDragOver = (event: any) => {
		event.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (event: any) => {
		setIsDragOver(false);
	};

	const handleDrop = async (event: any) => {
		event.preventDefault();
		setIsDragOver(false);

		const file = event.dataTransfer.files[0];
		await handleFileValidation(file);
	};

	const handleFileValidation = async (file: File) => {
		if (!isConnected || !isRoomJoined) return alert('Connection error...');

		if (file.size > CONFIG.dragAndDrop.maxFileSizeInBytes) {
			return alert(`Maximum filesize is ${CONFIG.dragAndDrop.maxFileSizeInBytes / 1_000_000} MB`);
		}

		const fileExtension = getFileExtension(file.name);
		if (!(CONFIG.dragAndDrop.acceptFiles.includes('*') || CONFIG.dragAndDrop.acceptFiles.includes(fileExtension))) {
			return alert(`This file type is not allowed! Allowed file types: ${CONFIG.dragAndDrop.acceptFiles.join(', ')}.`);
		}

		setIsUploading(true);

		try {
			const {msg, uniqueFilename}: any = await uploadFile(file, fileExtension);
			setFiles([{
				_id: uuidv4(),
				originalFilename: file.name,
				uniqueFilename: uniqueFilename,
				fileType: file.type,
				addedBy:  {
					_id: currentUser._id,
					picture: currentUser.picture,
					name: currentUser.name
				},
				addedAt: new Date()
			}, ...files]);
		} catch (error) {
			alert((error as any).msg || 'Server error');
		}

		setIsUploading(false);
	};

	const handleRemoveFile = async (fileToRemove: IWorkspaceSharedFile) => {
		setFileToRemove(fileToRemove);
		setOpenRemoveFileDialog(true);
	};

	const handleRemoveFileDialogClose = async (_remove: boolean) => {
		setOpenRemoveFileDialog(false);
		if (!_remove) {
			setFileToRemove(null);
			return;
		}

		if (fileToRemove == null) {
			return;
		}

		try {
			const {msg}: any = await removeFile(fileToRemove.uniqueFilename);
			setSharedFiles(
				files.filter((file: IWorkspaceSharedFile) => file.uniqueFilename !== fileToRemove.uniqueFilename)
			);
		} catch (error) {
			alert((error as any).msg || 'Server error');
		}

		setFileToRemove(null);
	};

	const uploadFile = (file: File, fileExtension: string) => new Promise((resolve, reject) => {
		if (socket == null || !isRoomJoined) return reject('No connection...');

		socket.emit('upload-file', file, file.name, fileExtension, file.type, (response: any) => {
			if (!response?.success) {
				return reject({
					msg: response?.msg,
					uniqueFilename: response?.uniqueFilename
				});
			}
			resolve({
				msg: response.msg,
				uniqueFilename: response.uniqueFilename
			});
		});
	});

	const removeFile = (uniqueFilename: string) => new Promise((resolve, reject) => {
		if (socket == null || !isRoomJoined) return reject('No connection...');

		socket.emit('remove-file', uniqueFilename, (response: any) => {
			if (!response?.success) {
				return reject({
					msg: response?.msg
				});
			}
			resolve({
				msg: response.msg
			});
		});
	});

	/* receiving shared files' info */
	useEffect(() => {
		if (socket == null) return;

		const handler = (sharedFile: any) => {
			setFiles([sharedFile, ...files]);
		};

		socket.on('receive-file', handler);

		return () => {
			socket.off('receive-file', handler);
		};
	}, [socket, files]);

	/* removing shared files */
	useEffect(() => {
		if (socket == null) return;

		const handler = (uniqueFilename: string) => {
			setSharedFiles(
				files.filter((file: IWorkspaceSharedFile) => file.uniqueFilename !== uniqueFilename)
			);
		};

		socket.on('remove-file', handler);

		return () => {
			socket.off('remove-file', handler);
		};
	}, [socket, files]);

	useEffect(() => {
		fileListBeginningRef.current?.scrollIntoView({behavior: "auto"}); // przewijanie na poczatek końca diva
	}, []);

	return <>
		<Box
			sx={{px: 2, py: 1, mx: 2, my: 1}}
			className={`dropzone ${isDragOver && 'dragover'}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={() => {
				fileInput.current?.click()
			}}
			ref={dropzoneArea}
		>
			Click to choose a file or drag it here!
			<input
				type="file"
				accept={CONFIG.dragAndDrop.acceptFiles.join(', ')}
				style={{display: 'none'}}
				onChange={handleFileChange}
				disabled={!isRoomJoined}
				ref={fileInput}
			/>
		</Box>

		<Box sx={{maxHeight: '30dvh', overflowY: 'auto'}}>
			<div ref={fileListBeginningRef}/>
			{/* pusty div użyty do ustawienia referencji */}
			{files?.map((file: IWorkspaceSharedFile) => <File key={uuidv4()} file={file}>
					<IconButton aria-label="delete" title={`delete ${file.originalFilename}`} size="small"
					            onClick={() => handleRemoveFile(file)}>
						<DeleteIcon fontSize="inherit" color="error"/>
					</IconButton>
				</File>
				)}
		</Box>

		<Dialog
			open={openRemoveFileDialog}
			onClose={() => {}}
		>
			<DialogTitle>
				Are you sure to permanently remove this file?
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{fileToRemove?.originalFilename}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleRemoveFileDialogClose(false)} autoFocus>Cancel</Button>
				<Button onClick={() => handleRemoveFileDialogClose(true)} color="error">Remove</Button>
			</DialogActions>
		</Dialog>
	</>;
};

export default DragnDrop;
