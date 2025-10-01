export default class MealController {
   static uploadPage(req, res) {
      res.render('meals/upload', {user: req.session.user});
   }

   static async analyze(req, res){
      try{

         if(!req.file){
            return res.status(400).send("No image uploaded");
         }


         const image_name = req.file.filename;
         const image_path = "/images/uploads/" + image_name;
         const meal_name = req.body.mealName || null;
         const meal_notes = req.body.notes || null;

         res.send('<img src="'+image_path+'"><br><h1>'+meal_name+'</h1><h2>'+meal_notes+'</h2>');

         

      }catch(err){
         console.error("Analyse function errors: ", err);
         res.status(500).send('An error occurred during analysis');
      }

   }
}
