import Recommendation from '../models/Recommendation.js';

export default class RecommendationController {
   static async index(req, res) {
      try {
         // const recommendations = await Recommendation.all();
         const recommendations = [];
         res.render('recommendations/index', {recommendations});
      } catch (err) {
         res.status(500).send(err.message);
      }
   }
}
