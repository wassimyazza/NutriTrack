import {checkSchema} from 'express-validator';

export const profileUpdateSchema = checkSchema({
   name: {
      notEmpty: {
         errorMessage: 'Le nom est obligatoire',
      },
      isLength: {
         options: {min: 3},
         errorMessage: 'Le nom doit contenir au moins 3 caractères',
      },
      trim: true,
   },

   email: {
      notEmpty: {
         errorMessage: "L'email est obligatoire",
      },
      isEmail: {
         errorMessage: 'Email invalide',
      },
      normalizeEmail: true,
   },

   password: {
      optional: true, // si l’utilisateur ne veut pas changer son mot de passe
      isLength: {
         options: {min: 6},
         errorMessage: 'Le mot de passe doit contenir au moins 6 caractères',
      },
   },

   age: {
      notEmpty: {
         errorMessage: "L'âge est obligatoire",
      },
      isInt: {
         options: {min: 1, max: 120},
         errorMessage: 'Âge doit être un entier valide (1-120)',
      },
      toInt: true,
   },

   gender: {
      notEmpty: {
         errorMessage: 'Le genre est obligatoire',
      },
      isIn: {
         options: [['male', 'female']],
         errorMessage: "Le genre doit être 'male' ou 'female'",
      },
   },

   height: {
      notEmpty: {
         errorMessage: 'La taille est obligatoire',
      },
      isFloat: {
         options: {min: 50, max: 250},
         errorMessage: 'La taille doit être entre 50cm et 250cm',
      },
      toFloat: true,
   },

   weight: {
      notEmpty: {
         errorMessage: 'Le poids est obligatoire',
      },
      isFloat: {
         options: {min: 20, max: 300},
         errorMessage: 'Le poids doit être entre 20kg et 300kg',
      },
      toFloat: true,
   },

   activity_level: {
      notEmpty: {
         errorMessage: "Le niveau d'activité est obligatoire",
      },
      isIn: {
         options: [['low', 'medium', 'high']],
         errorMessage: "Niveau d'activité invalide",
      },
   },

   goal: {
      notEmpty: {
         errorMessage: "L'objectif est obligatoire",
      },
      isIn: {
         options: [
            [
               'Lose weight',
               'Gain weight',
               'Maintain weight',
               'Improve performance',
            ],
         ],
         errorMessage: 'Objectif invalide',
      },
   },

   condition_user: {
      notEmpty: {
         errorMessage: 'La condition est obligatoire',
      },
      isIn: {
         options: [['diabetes', 'hypertension', 'obesity', 'athlete']],
         errorMessage: 'Condition invalide',
      },
   },
});
