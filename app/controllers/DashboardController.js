export default class DashboardController {
   static dashboard(req, res) {
      res.render('user/dashboard.ejs', {authUser: req.session.user});
   }
}
