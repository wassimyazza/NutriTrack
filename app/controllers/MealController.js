export default class MealController {
   static uploadPage(req, res) {
      res.render('meals/upload', {user: req.session.user});
   }
}
