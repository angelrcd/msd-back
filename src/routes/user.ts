import { Router } from 'express';
import userController from '../controllers/user';
import { validateAuthUser } from '../middlewares/validateAuthUser';
const multer = require('multer');


const router: Router = Router();
const upload = multer();

//USUARIOS
//Login


router.get('/', userController.getAll);
router.get('/myUser', [validateAuthUser], userController.getById);
router.post('/add', userController.add);

router.patch('/myUser', [validateAuthUser], userController.updateById);
router.delete('/myUser', [validateAuthUser], userController.deleteById);
router.put('/pfp', [validateAuthUser], upload.single('image') , userController.uploadProfilePic);
export default router;
