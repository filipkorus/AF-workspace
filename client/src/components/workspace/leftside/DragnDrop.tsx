import React, {useEffect, useRef, useState} from 'react';
import {
	Box,
	Button, Dialog, DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import '../../../styles/DragnDrop.css';
import CONFIG from '../../../config/index';
import {v4 as uuidv4} from 'uuid';
import File from './File';
import {useSocket} from '../../../contexts/SocketContext';
import {IWorkspaceSharedFile} from '../../../types';
import getFileExtension from '../../../utils/getFileExtension';
import {useAuth} from '../../../contexts/AuthContext';

const DragnDrop = ({sharedFiles, setSharedFiles}: {
	sharedFiles: IWorkspaceSharedFile[],
	setSharedFiles: React.Dispatch<React.SetStateAction<IWorkspaceSharedFile[]>>
}) => {
	const {currentUser}: any = useAuth();
	const {socket, isConnected, isRoomJoined}: any = useSocket();

	const fileInput = useRef<HTMLInputElement>(null);
	const dropzoneArea = useRef<HTMLInputElement>(null);

	const [isDragOver, setIsDragOver] = useState<boolean>(false);

	const fileListBeginningRef = useRef<HTMLDivElement>(null);

	const [fileToRemove, setFileToRemove] = useState<IWorkspaceSharedFile | null>(null);
	const [openRemoveFileDialog, setOpenRemoveFileDialog] = useState<boolean>(false);

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

		try {
			const {msg, uniqueFilename}: any = await uploadFile(file, fileExtension);
			setSharedFiles([{
				_id: uuidv4(),
				originalFilename: file.name,
				uniqueFilename: uniqueFilename,
				addedBy:  {
					_id: currentUser._id,
					picture: currentUser.picture,
					name: currentUser.name
				},
				addedAt: new Date()
			}, ...sharedFiles]);
		} catch (error) {
			alert((error as any).msg || 'Server error');
		}
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
				sharedFiles.filter((file: IWorkspaceSharedFile) => file.uniqueFilename !== fileToRemove.uniqueFilename)
			);
		} catch (error) {
			alert((error as any).msg || 'Server error');
		}

		setFileToRemove(null);
	};

	const uploadFile = (file: File, fileExtension: string) => new Promise((resolve, reject) => {
		if (socket == null || !isRoomJoined) return reject('No connection...');

		socket.emit('upload-file', file, file.name, fileExtension, (response: any) => {
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
			setSharedFiles([sharedFile, ...sharedFiles]);
		};

		socket.on('receive-file', handler);

		return () => {
			socket.off('receive-file', handler);
		};
	}, [socket, sharedFiles]);

	/* removing shared files */
	useEffect(() => {
		if (socket == null) return;

		const handler = (uniqueFilename: string) => {
			setSharedFiles(
				sharedFiles.filter((file: IWorkspaceSharedFile) => file.uniqueFilename !== uniqueFilename)
			);
		};

		socket.on('remove-file', handler);

		return () => {
			socket.off('remove-file', handler);
		};
	}, [socket, sharedFiles]);

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
				multiple={false}
				accept={CONFIG.dragAndDrop.acceptFiles.join(', ')}
				style={{display: 'none'}}
				onChange={handleFileChange}
				disabled={!isRoomJoined}
				ref={fileInput}
			/>
		</Box>

		<Box sx={{maxHeight: '30dvh', overflowY: 'auto'}}>
			<div ref={fileListBeginningRef}/>
			{sharedFiles?.map((file: IWorkspaceSharedFile) => <File key={uuidv4()} file={file} handleRemoveFile={(file: IWorkspaceSharedFile) => handleRemoveFile(file)} />)}
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
