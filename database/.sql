-- Base de données NutriTrack (MySQL avec AUTO_INCREMENT)
CREATE DATABASE IF NOT EXISTS NutriTrack;
USE NutriTrack;

-- Table users (avec AUTO_INCREMENT)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name VARCHAR(200) NOT NULL,
    sex ENUM('male', 'female'),
    height_cm DECIMAL(6,2),
    weight_kg DECIMAL(6,2),
    target_weight_kg DECIMAL(6,2),
    date_of_birth DATE,
    activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') DEFAULT 'moderate',
    type_profile ENUM('athlete', 'weight_loss', 'weight_gain', 'diabetes', 'obesity', 'hypertension') NOT NULL,
    target_calories INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des aliments de référence
CREATE TABLE foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    calories_per_100g DECIMAL(8,2) NOT NULL,
    protein_per_100g DECIMAL(6,2) DEFAULT 0,
    carbs_per_100g DECIMAL(6,2) DEFAULT 0,
    fat_per_100g DECIMAL(6,2) DEFAULT 0,
    fiber_per_100g DECIMAL(6,2) DEFAULT 0,
    sodium_per_100g DECIMAL(8,2) DEFAULT 0,
    sugar_per_100g DECIMAL(6,2) DEFAULT 0,
    glycemic_index INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des repas
CREATE TABLE meals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    meal_date DATE NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    image_url TEXT,
    analysis_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    total_calories DECIMAL(8,2) DEFAULT 0,
    total_protein DECIMAL(6,2) DEFAULT 0,
    total_carbs DECIMAL(6,2) DEFAULT 0,
    total_fat DECIMAL(6,2) DEFAULT 0,
    total_fiber DECIMAL(6,2) DEFAULT 0,
    total_sodium DECIMAL(8,2) DEFAULT 0,
    total_sugar DECIMAL(6,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des aliments dans les repas
CREATE TABLE meal_foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meal_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity_g DECIMAL(8,2) NOT NULL,
    confidence_score DECIMAL(3,2), -- Score de confiance de l'IA
    calories DECIMAL(8,2) NOT NULL,
    protein DECIMAL(6,2) DEFAULT 0,
    carbs DECIMAL(6,2) DEFAULT 0,
    fat DECIMAL(6,2) DEFAULT 0,
    fiber DECIMAL(6,2) DEFAULT 0,
    sodium DECIMAL(8,2) DEFAULT 0,
    sugar DECIMAL(6,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id)
);

-- Table recommandations (complétée pour MySQL)
CREATE TABLE recommandations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    recommendation_type ENUM('pre_workout', 'post_workout', 'medical_alert', 'meal_adjustment', 'hydration', 'general') DEFAULT 'general',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    related_meal_id INT DEFAULT NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_meal_id) REFERENCES meals(id) ON DELETE SET NULL
);

-- Table de suivi du poids
CREATE TABLE weight_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    weight_kg DECIMAL(6,2) NOT NULL,
    body_fat_percentage DECIMAL(4,2),
    muscle_mass_kg DECIMAL(6,2),
    measurement_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des rapports hebdomadaires
CREATE TABLE weekly_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_meals INTEGER DEFAULT 0,
    avg_calories DECIMAL(8,2),
    avg_protein DECIMAL(6,2),
    avg_carbs DECIMAL(6,2),
    avg_fat DECIMAL(6,2),
    avg_sodium DECIMAL(8,2),
    avg_sugar DECIMAL(6,2),
    weight_change_kg DECIMAL(5,2),
    adherence_percentage DECIMAL(5,2), -- % d'adhésion aux objectifs
    report_data JSON, -- Données détaillées en JSON
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Index pour les performances
CREATE INDEX idx_meals_user_date ON meals(user_id, meal_date);
CREATE INDEX idx_meals_analysis_status ON meals(analysis_status);
CREATE INDEX idx_recommandations_user_unread ON recommandations(user_id, is_read);
CREATE INDEX idx_weight_tracking_user_date ON weight_tracking(user_id, measurement_date);

CREATE INDEX idx_weekly_reports_user_week ON weekly_reports(user_id, week_start_date);

-- Insertion des profils nutritionnels de base


-- Insertion d'aliments de base
-- INSERT INTO foods (name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sodium_per_100g, sugar_per_100g, glycemic_index) VALUES
-- ('Pomme', 'fruits', 52.00, 0.30, 14.00, 0.20, 2.40, 1.00, 10.40, 35),
-- ('Banane', 'fruits', 89.00, 1.10, 23.00, 0.30, 2.60, 1.00, 12.20, 55),
-- ('Riz blanc cuit', 'cereales', 130.00, 2.70, 28.00, 0.30, 0.40, 5.00, 0.10, 70),
-- ('Poulet blanc grillé', 'proteines', 165.00, 31.00, 0.00, 3.60, 0.00, 74.00, 0.00, 0),
-- ('Brocoli', 'legumes', 34.00, 2.80, 7.00, 0.40, 2.60, 33.00, 1.50, 15),
-- ('Saumon grillé', 'proteines', 208.00, 25.40, 0.00, 12.40, 0.00, 593.00, 0.00, 0),
-- ('Avocat', 'fruits', 160.00, 2.00, 9.00, 15.00, 7.00, 7.00, 0.70, 15),
-- ('Pain complet', 'cereales', 247.00, 13.00, 41.00, 4.20, 7.40, 550.00, 6.00, 55),
-- ('Yaourt grec nature', 'laitiers', 97.00, 9.00, 4.00, 5.00, 0.00, 36.00, 4.00, 35),
-- ('Huile d\'olive', 'lipides', 884.00, 0.00, 0.00, 100.00, 0.00, 2.00, 0.00, 0);
