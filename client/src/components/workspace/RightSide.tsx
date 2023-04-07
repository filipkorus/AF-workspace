import React from 'react';
import theme from '../../utils/theme';
import {Box, Grid} from '@mui/material';

const RightSide = () => {
	return <Grid item xs={2.5} style={{
		backgroundColor: theme.palette.primary.main,
		height: '98%',
		margin: '0.5%',
		justifyContent: 'center',
		alignItems: 'center'
	}}>
		<Box style={{
			backgroundColor: theme.palette.secondary.main,
			height: '99%',
			width: '95%',
			padding: '0.5%'
		}}
		>
			jak tu zrobic formatowanie kodu bo nie umiem <br/>
			czat + kto edytuje ten shiet <br/>
			czemu tu nie kupa dzialaja entery jednak dzialaja dzieki czat jednak nie dzialaja japierodleee a jednak
			dzialaja buahahahaha
		</Box>
	</Grid>
};

export default RightSide;