import {SUCCESS} from '../../helpers/responses/messages';
import {getAllWorkspacesByUserId} from '../../services/workspace/document.service';

export const GetUserWorkspaces = async (req, res) => {
	return SUCCESS(res, {workspaces: await getAllWorkspacesByUserId(res.locals.user.id)});
};
