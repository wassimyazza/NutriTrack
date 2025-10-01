export default class MealController {
   static uploadPage(req, res) {
      res.render('meals/upload', {user: req.session.user});
   }

   static async analyze(req, res){

      const image_meal = req.body.mealImage;
      const meal_name = req.body.mealName || null;
      const meal_notes = req.body.notes || null;

      res.send(image_meal+" "+meal_name+" "+meal_notes);
      
   }
}
