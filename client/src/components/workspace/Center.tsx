import React from 'react';
import {Avatar, Grid} from '@mui/material';
import theme from '../../utils/theme';
import {useParams} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';

const Center = () => {
	const {id} = useParams(); // w zmiennej id jest ID workspace'a z końcówki URLa /workspace/:id
	const {currentUser}: any = useAuth();

	return <Grid
		item
		xs={7}
		style={{
			backgroundColor: theme.palette.primary.main,
			height: "98%",
			justifyContent: 'stretch',
			alignItems: 'center',
			alignContent: "center"
		}}
	>
		{/*DISCLAIMER: wszystko to co tu dalem to po to zebys widziala oki*/}
		{/*jak mozna wyswietlac dane aktualnie zalogowanego uzytkownika itp*/}
		to jest workspace z id={id}
		<br/><br/>{/* tagow br nie powinno sie wgl uzywac jak cos - ja uzylem roboczo */}
		dane aktualnie zalogowanego usera: {JSON.stringify(currentUser)}
		<br/><br/>
		<Avatar
			alt={currentUser.name}
			src={currentUser.picture}
			sx={{width: 56, height: 56}}
		/>
	</Grid>;
};

export default Center;
