export default class ProfileController {
   static show(res, req) {
      req.render('profile/index');
   }

   static update(res, req) {}
}
