const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);
router.delete('/:email', userController.deleteUser)
router.put('/:email', userController.updateUser)


router.get('/admin', userController.getAllRegistrations);
router.get('/getuser/:id', userController.getUser);
router.get('/registrations/:email', userController.getUserRegistrations);
router.delete('/registrations/:email', userController.deleteRegistration);
router.get('/checkByEmail/:email', userController.checkByEmail);
router.post('/signupforservice', userController.SignUpForService)
router.get('/allsignupforservice', userController.getAllRegistrations)


module.exports = router;
