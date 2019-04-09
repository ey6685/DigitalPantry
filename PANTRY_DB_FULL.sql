<<<<<<< HEAD:THE_DB_TABLES.sql
-- MySQL dump 10.13  Distrib 8.0.14, for Win64 (x86_64)
--
-- Host: localhost    Database: digital_pantry
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL AUTO_INCREMENT,
  `ingredient_name` varchar(32) NOT NULL,
  `ingredient_weight` int(11) DEFAULT NULL,
  `ingredient_image_path` text,
  `ingredient_num_times_cooked` int(11) DEFAULT '0',
  `priority` enum('High','Low') DEFAULT 'Low',
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES
(1, 'Chicken', 3, '/images/1554173732619.jpg', 0, 'High'),
(2, 'Canned Black Beans', 1, '/images/1554174096072.jpg', 0, 'Low'),
(3, 'Carrot', 3, '/images/placeholder.jpg', 0, 'Low'),
(4, 'Potato chips', 1, '/images/placeholder.jpg', 0, 'Low'),
(5, 'Ground Pepper', 0, '/images/1554174281993.jpg', 0, 'Low'),
(6, 'Chicken Broth', 3, '/images/placeholder.jpg', 0, 'Low'),
(7, 'Canned Tuna', 1, '/images/placeholder.jpg', 0, 'Low'),
(8, 'Frozen Mixed Vegetables', 1, '/images/placeholder.jpg', 0, 'Low'),
(9, 'Slice Mozzarella Cheeze', 2, '/images/1554174459952.jpg', 0, 'Low'),
(10, 'Condensed Ckicken Soup', 1, '/images/condensed_chicken.jpg', 0, 'Low'),
(11, 'Water', 0, '/images/water.jpg', 0, 'Low'),
(12, 'Mixed Vegetables', 2, '/images/1554173885043.jpg', 0, 'Low'),
(13, 'Cream of Chicken Soup', 1, '/images/1554174059749.jpg', 0, 'Low'),
(14, 'Milk', 3, '/images/1554174134107.jpg', 0, 'High'),
(15, 'Biscuits Mix', 1, '/images/1554174237381.jpg', 0, 'Low'),
(16, 'Noodles', 1, '/images/1554174318249.jpg', 0, 'Low'),
(17, 'Green Peas', 2, '/images/1554175099505.jpg', 0, 'Low'),
(18, 'Cream of Mushroom Soup', 1, '/images/1554174951929.jpg', 0, 'Low'),
(19, 'Tuna', 2, '/images/1554174668636.jpg', 0, 'High'),
(20, 'Onions', 2, '/images/1554175725241.jpg', 0, 'Low'),
(21, 'French Bread', 3, '/images/1554175756719.jpg', 0, 'Low'),
(22, 'Shredded Mozzarella Cheese', 2, '/images/1554174459952.jpg', 0, 'Low'),
(23, 'Mayonnaise', 1, '/images/1554175695449.jpg', 0, 'Low'),
(24, 'Corn', 2, '/images/1554174840465.jpg', 0, 'Low'),
(25, 'Tortilla Chips', 1, '/images/tortilla_chips.jpg', 0, 'Low'),
(26, 'Salsa', 2, '/images/1554175182305.jpg', 0, 'Low'),
(27, 'Canned Cream Corn', 2, '/images/1554174840465.jpg', 0, 'Low'),
(28, 'Vegetable Oil', 1, '/images/1554175925139.jpg', 0, 'Low'),
(29, 'Garlic', 2, '/images/1554175948246.jpg', 0, 'Low'),
(30, 'Turkey', 3, '/images/1554175982930.jpg', 0, 'High'),
(31, 'Canned Diced Tomatoes', 1, '/images/1554176022125.jpg', 0, 'Low'),
(32, 'Chili Powder', 1, '/images/1554174995805.jpg', 0, 'Low');
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients_in_a_recipe`
--

DROP TABLE IF EXISTS `ingredients_in_a_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients_in_a_recipe` (
  `recipe_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `pantry_id` int(11) NOT NULL,
  `amount_of_ingredient_needed` float NOT NULL,
  `ingredient_unit_of_measurement` enum('tsp.','tbsp.','fl oz','cup','quart','ml','lb','oz') DEFAULT NULL,
  KEY `recipe_id` (`recipe_id`),
  KEY `ingredient_id` (`ingredient_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `ingredients_in_a_recipe_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `ingredients_in_a_recipe_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`),
  CONSTRAINT `ingredients_in_a_recipe_ibfk_3` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients_in_a_recipe`
--

LOCK TABLES `ingredients_in_a_recipe` WRITE;
/*!40000 ALTER TABLE `ingredients_in_a_recipe` DISABLE KEYS */;
INSERT INTO `ingredients_in_a_recipe` VALUES (1,1,1,2,'cup'),(1,10,1,12,'oz'),(1,11,1,12,'oz'),(1,12,1,1,'cup'),(2,25,1,16,'oz'),(2,2,1,10,'oz'),(4,13,1,12,'oz'),(4,14,1,1,'cup'),(4,12,1,3,'cup'),(4,1,1,1,'lb'),(4,15,1,1,'cup'),(5,16,1,12,'oz'),(5,17,1,12,'cup'),(5,18,1,24,'oz'),(5,19,1,10,'oz'),(5,20,1,2,'oz'),(6,21,1,1,'lb'),(6,20,1,5,'oz'),(6,22,1,2,'cup'),(6,23,1,1,'cup'),(6,19,1,12,'oz'),(7,2,1,12,'oz'),(7,24,1,12,'oz'),(7,25,1,24,'oz'),(7,26,1,16,'oz'),(8,28,1,1,'tbsp.'),(8,20,1,5,'oz'),(8,29,1,2,'oz'),(8,30,1,1,'lb'),(8,2,1,45,'oz'),(8,31,1,15,'oz'),(8,32,1,2,'tbsp.');
/*!40000 ALTER TABLE `ingredients_in_a_recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients_in_pantry`
--

DROP TABLE IF EXISTS `ingredients_in_pantry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients_in_pantry` (
  `ingredient_id` int(11) NOT NULL,
  `pantry_id` int(11) DEFAULT NULL,
  `ingredient_amount` float DEFAULT NULL,
  `ingredient_unit_of_measurement` enum('tsp.','tbsp.','fl oz','cup','quart','ml','lb','oz') DEFAULT NULL,
  `ingredient_expiration_date` date DEFAULT NULL,
  KEY `ingredient_id` (`ingredient_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `ingredients_in_pantry_ibfk_1` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`),
  CONSTRAINT `ingredients_in_pantry_ibfk_2` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients_in_pantry`
--

LOCK TABLES `ingredients_in_pantry` WRITE;
/*!40000 ALTER TABLE `ingredients_in_pantry` DISABLE KEYS */;
INSERT INTO `ingredients_in_pantry` VALUES (1,1,6,'cup','2019-04-20'),(2,1,12,'oz','2019-04-01'),(5,1,4,'cup','2019-03-30'),(9,1,3,'lb','2019-03-25'),(10,1,24,'oz','2019-03-22'),(11,1,12,'oz',NULL),(12,1,6,'cup','2019-04-02'),(13,1,12,'oz','2019-04-03'),(14,1,3,'cup','2019-04-04'),(15,1,4,'cup','2019-04-05'),(16,1,12,'oz','2019-04-06'),(17,1,2,'cup','2019-04-07'),(18,1,24,'oz','2019-03-22'),(19,1,24,'oz','2019-03-22'),(20,1,10,'oz','2019-04-09'),(21,1,1,'lb','2019-04-01'),(22,1,2,'tbsp.','2019-04-19'),(23,1,10,'cup','2019-04-11'),(26,1,16,'oz','2019-04-14'),(28,1,1,'tbsp.','2019-04-15'),(29,1,2,'oz','2019-04-16'),(30,1,1,'lb','2019-04-17'),(31,1,15,'oz','2019-04-18'),(32,1,200,'oz','2019-03-29'),(1,1,5,'lb','2019-04-20'),(5,1,5,'oz','2019-03-10'),(1,1,4,'lb','2019-04-20');
/*!40000 ALTER TABLE `ingredients_in_pantry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pantry`
--

DROP TABLE IF EXISTS `pantry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `pantry` (
  `pantry_id` int(11) NOT NULL AUTO_INCREMENT,
  `pantry_name` varchar(255) DEFAULT NULL,
  `expire_window` int(11) DEFAULT '5',
  `pantry_image_path` text,
  `people_cooking_for` int(11) DEFAULT '2',
  PRIMARY KEY (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantry`
--

LOCK TABLES `pantry` WRITE;
/*!40000 ALTER TABLE `pantry` DISABLE KEYS */;
INSERT INTO `pantry` VALUES (1,'Jons digial checkin pantry',5,NULL,5),(2,'Jons digial checkin pantry',5,NULL,2),(3,'',5,NULL,2),(4,'',5,NULL,2),(5,'',5,NULL,2),(6,'',5,NULL,2),(7,'',5,NULL,2),(8,'',5,NULL,2),(9,'',5,NULL,2);
/*!40000 ALTER TABLE `pantry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_name` varchar(32) DEFAULT NULL,
  `recipe_image_path` text,
  `recipe_directions` text,
  `recipe_num_times_cooked` int(11) DEFAULT '0',
  `pantry_id` int(11) DEFAULT NULL,
  `num_people_it_feeds` int(11) DEFAULT '1',
  `sharable` tinyint(1) DEFAULT '0',
  `recipe_weight` int(11) DEFAULT '1',
  PRIMARY KEY (`recipe_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
<<<<<<< HEAD
INSERT INTO `recipes` VALUES (1,'Chicken Noodle Soup','/images/chicken_noodle_soup.jpg','Combine ingredients into pot#Boil and stir till cooked#Serve warm',0,1,1,0,6),(2,'Chip n Beans','/images/bean_salsa.jpg','Boil beans in pot.#Serve warm with chips.',0,1,1,1,2),(4,'Chicken Pot Pie','/images/chicken_pot_pie.jpg','Heat the oven to 400°F.  Stir the soup, 1/2 cup milk, vegetables and chicken in a 9-inch pie plate.#Stir the remaining 1/2 cup milk, egg and baking mix in a small bowl.  Spread the batter over the chicken mixture (the batter is thin but will bake up into a perfect crust).#Bake for 20 minutes or until the topping is golden brown.',0,1,5,0,10),(5,'Tuna Casserole','/images/placeholder.jpg','Bring a large pot of water to a boil.#Add noodles and frozen peas.#Cook until noodles are al dente, drain well.#Return noodles and peas to the pot.#Mix soup, tuna fish, onions, processed cheese and pepper into the pot.#Stir constantly until all of the ingredients are well mixed and the cheese has melted. Serve.',0,1,5,0,8),(6,'Tuna Melt','/images/placeholder.jpg','Preheat oven to 350 degrees F (175 degrees C).#In a mixing bowl, combine sweet onion, drained tuna, mozzarella, and mayonnaise. Mix thoroughly.#Spread tuna mixture on slices of French bread to form a sandwich. Place sandwiches on a cookie sheet.#Bake in a preheated oven for 10 minutes.',0,1,5,0,10),(7,'Black Bean Salsa','/images/bean_salsa.jpg','In a large bowl combine the black beans, corn, and salsa.#Let it sit for 30 minutes.# Serve',0,1,5,0,6),(8,'Black Bean Chili','/images/placeholder.jpg','Heat the oil in a large heavy pot over medium heat.#cook onion and garlic until onions are translucent.#Add turkey and cook, stirring, until meat is brown. Stir in beans, tomatoes, chili powder, oregano, basil and vinegar.#Reduce heat to low, cover and simmer 60 minutes or more, until flavors are well blended.',0,1,10,0,11);
=======
INSERT INTO `recipes` VALUES (1, 'Chicken Noodle Soup', '/images/chicken_noodle_soup.jpg', 'Combine ingredients into pot#Boil and stir till cooked#Serve warm', 0, 1, 1, 0, 6),
(2, 'Chip n Beans', '/images/bean_salsa.jpg', 'Boil beans in pot.#Serve warm with chips.', 0, 1, 1, 1, 2),
(4, 'Chicken Pot Pie', '/images/chicken_pot_pie.jpg', 'Heat the oven to 400°F.  Stir the soup, 1/2 cup milk, vegetables and chicken in a 9-inch pie plate.#Stir the remaining 1/2 cup milk, egg and baking mix in a small bowl.  Spread the batter over the chicken mixture (the batter is thin but will bake up into a perfect crust).#Bake for 20 minutes or until the topping is golden brown.', 0, 1, 5, 0, 10),
(5, 'Tuna Casserole', '/images/1554177436001.jpg', 'Bring a large pot of water to a boil.#Add noodles and frozen peas.#Cook until noodles are al dente, drain well.#Return noodles and peas to the pot.#Mix soup, tuna fish, onions, processed cheese and pepper into the pot.#Stir constantly until all of the ingredients are well mixed and the cheese has melted. Serve.', 0, 1, 5, 0, 8),
(6, 'Tuna Melt', '/images/1554177393883.jpg', 'Preheat oven to 350 degrees F (175 degrees C).#In a mixing bowl, combine sweet onion, drained tuna, mozzarella, and mayonnaise. Mix thoroughly.#Spread tuna mixture on slices of French bread to form a sandwich. Place sandwiches on a cookie sheet.#Bake in a preheated oven for 10 minutes.', 0, 1, 5, 0, 10),
(7, 'Black Bean Salsa', '/images/bean_salsa.jpg', 'In a large bowl combine the black beans, corn, and salsa.#Let it sit for 30 minutes.# Serve', 0, 1, 5, 0, 6),
(8, 'Black Bean Chili', '/images/1554177341501.jpg', 'Heat the oil in a large heavy pot over medium heat.#cook onion and garlic until onions are translucent.#Add turkey and cook, stirring, until meat is brown. Stir in beans, tomatoes, chili powder, oregano, basil and vinegar.#Reduce heat to low, cover and simmer 60 minutes or more, until flavors are well blended.', 0, 1, 10, 0, 11);
>>>>>>> development
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `username` varchar(32) DEFAULT NULL,
  `user_password` text,
  `user_email` tinytext,
  `pantry_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` enum('Volunteer','Administrator') DEFAULT 'Volunteer',
  PRIMARY KEY (`user_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('test','test','test@test.com',1,4,'Volunteer'),('admin','$2a$10$qotOtv0VfegBp36/muW9neIGJYPmv470PYR7oS11.Lrjwo/WUkd1y','et8492@wayne.edu',1,9,'Volunteer'),('admin','$2a$10$S5tTpwlmQEQY03U.G1mpbOWjU9wPGtApKX9RyiDMdc.gvQeWjJrsO','et8492@wayne.edu',1,10,'Volunteer'),('quastan@live.com','$2a$10$R0/SpFJOHHUyKiz5Yzy4xeUv33cgbdQ.bboHuY1Vl.4v8FiFpnh8W','quastan@live.com',1,11,'Administrator'),('admin','$2a$10$wRudyksT/2MCVOcj4TctVu5QrJg4gUlLQWKsTyJ8HDc5PYMBvHBsC','jenna291991@gmail.com',3,12,'Volunteer'),('admin','$2a$10$Zg3f7FieL/J6Ch9hHefSYuJ.e6PDZIJmiLk3oLRl0Xqm35ctsiZS6','pat9592@yahoo.com',8,15,'Volunteer'),('quastan@live.com','$2a$10$DOl83/1nofHtU/auUA4J6esckvkCOZt9qfgNJQxHE4E/rhgZHn0B6','quastan@live.com',1,16,'Volunteer'),('quastan@live.com','$2a$10$86EfDlHxR.Bw/Ki/5E1.SezL6DoSL.RR7UvGQtu9Z7yz/8qxSykS.','quastan@live.com',1,17,'Administrator'),('thisis@test.com','$2a$10$pOhWQpNZGnXPoSaAMQ0reuE0bx5MhlabdenGwkcT0gv03YbmkfRza','thisis@test.com',1,18,'Administrator'),('quastan@live.com','$2a$10$.hktGT/xusiDZoIRCYGDvukz/UoRw6AGhXa87RqmvXwpq4BhPr75S','quastan@live.com',1,19,'Administrator'),('admin','$2a$10$Un4KynrwZ38dqoKC5Wk2/uyvR6BW0ggrmckI8upbuyIYSfDELpo2a','pat9592@yahoo.com',9,20,'Volunteer');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-01 13:07:31
=======
-- MySQL dump 10.13  Distrib 8.0.14, for Win64 (x86_64)
--
-- Host: localhost    Database: digital_pantry
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL AUTO_INCREMENT,
  `ingredient_name` varchar(32) NOT NULL,
  `ingredient_weight` int(11) DEFAULT NULL,
  `ingredient_image_path` text,
  `ingredient_num_times_cooked` int(11) DEFAULT '0',
  `priority` enum('High','Low') DEFAULT 'Low',
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES
(1, 'Chicken', 3, '/images/1554173732619.jpg', 0, 'High'),
(2, 'Canned Black Beans', 1, '/images/1554174096072.jpg', 0, 'Low'),
(3, 'Carrot', 3, '/images/placeholder.jpg', 0, 'Low'),
(4, 'Potato chips', 1, '/images/placeholder.jpg', 0, 'Low'),
(5, 'Ground Pepper', 0, '/images/1554174281993.jpg', 0, 'Low'),
(6, 'Chicken Broth', 3, '/images/placeholder.jpg', 0, 'Low'),
(7, 'Canned Tuna', 1, '/images/placeholder.jpg', 0, 'Low'),
(8, 'Frozen Mixed Vegetables', 1, '/images/placeholder.jpg', 0, 'Low'),
(9, 'Slice Mozzarella Cheeze', 2, '/images/1554174459952.jpg', 0, 'Low'),
(10, 'Condensed Ckicken Soup', 1, '/images/condensed_chicken.jpg', 0, 'Low'),
(11, 'Water', 0, '/images/water.jpg', 0, 'Low'),
(12, 'Mixed Vegetables', 2, '/images/1554173885043.jpg', 0, 'Low'),
(13, 'Cream of Chicken Soup', 1, '/images/1554174059749.jpg', 0, 'Low'),
(14, 'Milk', 3, '/images/1554174134107.jpg', 0, 'High'),
(15, 'Biscuits Mix', 1, '/images/1554174237381.jpg', 0, 'Low'),
(16, 'Noodles', 1, '/images/1554174318249.jpg', 0, 'Low'),
(17, 'Green Peas', 2, '/images/1554175099505.jpg', 0, 'Low'),
(18, 'Cream of Mushroom Soup', 1, '/images/1554174951929.jpg', 0, 'Low'),
(19, 'Tuna', 2, '/images/1554174668636.jpg', 0, 'High'),
(20, 'Onions', 2, '/images/1554175725241.jpg', 0, 'Low'),
(21, 'French Bread', 3, '/images/1554175756719.jpg', 0, 'Low'),
(22, 'Shredded Mozzarella Cheese', 2, '/images/1554174459952.jpg', 0, 'Low'),
(23, 'Mayonnaise', 1, '/images/1554175695449.jpg', 0, 'Low'),
(24, 'Corn', 2, '/images/1554174840465.jpg', 0, 'Low'),
(25, 'Tortilla Chips', 1, '/images/tortilla_chips.jpg', 0, 'Low'),
(26, 'Salsa', 2, '/images/1554175182305.jpg', 0, 'Low'),
(27, 'Canned Cream Corn', 2, '/images/1554174840465.jpg', 0, 'Low'),
(28, 'Vegetable Oil', 1, '/images/1554175925139.jpg', 0, 'Low'),
(29, 'Garlic', 2, '/images/1554175948246.jpg', 0, 'Low'),
(30, 'Turkey', 3, '/images/1554175982930.jpg', 0, 'High'),
(31, 'Canned Diced Tomatoes', 1, '/images/1554176022125.jpg', 0, 'Low'),
(32, 'Chili Powder', 1, '/images/1554174995805.jpg', 0, 'Low');
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients_in_a_recipe`
--

DROP TABLE IF EXISTS `ingredients_in_a_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients_in_a_recipe` (
  `recipe_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `pantry_id` int(11) NOT NULL,
  `amount_of_ingredient_needed` float NOT NULL,
  `ingredient_unit_of_measurement` enum('tsp.','tbsp.','fl oz','cup','quart','ml','lb','oz') DEFAULT NULL,
  KEY `recipe_id` (`recipe_id`),
  KEY `ingredient_id` (`ingredient_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `ingredients_in_a_recipe_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `ingredients_in_a_recipe_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`),
  CONSTRAINT `ingredients_in_a_recipe_ibfk_3` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients_in_a_recipe`
--

LOCK TABLES `ingredients_in_a_recipe` WRITE;
/*!40000 ALTER TABLE `ingredients_in_a_recipe` DISABLE KEYS */;
INSERT INTO `ingredients_in_a_recipe` VALUES (1,1,1,2,'cup'),(1,10,1,12,'oz'),(1,11,1,12,'oz'),(1,12,1,1,'cup'),(2,25,1,16,'oz'),(2,2,1,10,'oz'),(4,13,1,12,'oz'),(4,14,1,1,'cup'),(4,12,1,3,'cup'),(4,1,1,1,'lb'),(4,15,1,1,'cup'),(5,16,1,12,'oz'),(5,17,1,12,'cup'),(5,18,1,24,'oz'),(5,19,1,10,'oz'),(5,20,1,2,'oz'),(6,21,1,1,'lb'),(6,20,1,5,'oz'),(6,22,1,2,'cup'),(6,23,1,1,'cup'),(6,19,1,12,'oz'),(7,2,1,12,'oz'),(7,24,1,12,'oz'),(7,25,1,24,'oz'),(7,26,1,16,'oz'),(8,28,1,1,'tbsp.'),(8,20,1,5,'oz'),(8,29,1,2,'oz'),(8,30,1,1,'lb'),(8,2,1,45,'oz'),(8,31,1,15,'oz'),(8,32,1,2,'tbsp.');
/*!40000 ALTER TABLE `ingredients_in_a_recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients_in_pantry`
--

DROP TABLE IF EXISTS `ingredients_in_pantry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ingredients_in_pantry` (
  `ingredient_id` int(11) NOT NULL,
  `pantry_id` int(11) DEFAULT NULL,
  `ingredient_amount` float DEFAULT NULL,
  `ingredient_unit_of_measurement` enum('tsp.','tbsp.','fl oz','cup','quart','ml','lb','oz') DEFAULT NULL,
  `ingredient_expiration_date` date DEFAULT NULL,
  KEY `ingredient_id` (`ingredient_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `ingredients_in_pantry_ibfk_1` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`),
  CONSTRAINT `ingredients_in_pantry_ibfk_2` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients_in_pantry`
--

LOCK TABLES `ingredients_in_pantry` WRITE;
/*!40000 ALTER TABLE `ingredients_in_pantry` DISABLE KEYS */;
INSERT INTO `ingredients_in_pantry` VALUES
(2, 1, 90, 'oz', '2019-04-18'),
(5, 1, 4, 'cup', '2019-04-01'),
(9, 1, 3, 'lb', '2019-04-01'),
(10, 1, 24, 'oz', '2019-04-21'),
(11, 1, 12, 'oz', NULL),
(12, 1, 6, 'cup', '2019-04-22'),
(13, 1, 12, 'oz', '2019-04-23'),
(14, 1, 3, 'cup', '2019-04-01'),
(15, 1, 4, 'cup', '2019-04-24'),
(16, 1, 12, 'oz', '2019-04-25'),
(17, 1, 2, 'cup', '2019-04-26'),
(18, 1, 24, 'oz', '2019-04-27'),
(19, 1, 24, 'oz', '2019-04-01'),
(20, 1, 10, 'oz', '2019-04-28'),
(21, 1, 1, 'lb', '2019-04-29'),
(22, 1, 2, 'tbsp.', '2019-04-30'),
(23, 1, 10, 'cup', '2019-05-01'),
(26, 1, 16, 'oz', '2019-05-02'),
(28, 1, 1, 'tbsp.', '2019-05-03'),
(29, 1, 2, 'oz', '2019-04-18'),
(30, 1, 1, 'lb', '2019-04-19'),
(31, 1, 15, 'oz', '2019-04-20'),
(32, 1, 6, 'oz', '2019-04-21'),
(1, 1, 4, 'lb', '2019-04-22'),
(32, 1, 6, 'tbsp.', '2019-04-30'),
(1, 1, 6, 'cup', '2019-04-30'),
(14, 1, 30, 'cup', '2019-04-30'),
(17, 1, 60, 'cup', '2019-04-30'),
(19, 1, 35, 'oz', '2019-04-30'),
(22, 1, 10, 'cup', '2019-04-30'),
(25, 1, 50, 'oz', '2019-04-30'),
(24, 1, 30, 'oz', '2019-04-30');
/*!40000 ALTER TABLE `ingredients_in_pantry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pantry`
--

DROP TABLE IF EXISTS `pantry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `pantry` (
  `pantry_id` int(11) NOT NULL AUTO_INCREMENT,
  `pantry_name` varchar(255) DEFAULT NULL,
  `expire_window` int(11) DEFAULT '5',
  `pantry_image_path` text,
  `people_cooking_for` int(11) DEFAULT '2',
  PRIMARY KEY (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantry`
--

LOCK TABLES `pantry` WRITE;
/*!40000 ALTER TABLE `pantry` DISABLE KEYS */;
INSERT INTO `pantry` VALUES (1,'Jons digial checkin pantry',5,NULL,2),(2,'Jons digial checkin pantry',5,NULL,2),(3,'',5,NULL,2),(4,'',5,NULL,2),(5,'',5,NULL,2),(6,'',5,NULL,2),(7,'',5,NULL,2),(8,'',5,NULL,2),(9,'',5,NULL,2);
/*!40000 ALTER TABLE `pantry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_name` varchar(32) DEFAULT NULL,
  `recipe_image_path` text,
  `recipe_directions` text,
  `recipe_num_times_cooked` int(11) DEFAULT '0',
  `pantry_id` int(11) DEFAULT NULL,
  `num_people_it_feeds` int(11) DEFAULT '1',
  `sharable` tinyint(1) DEFAULT '0',
  `recipe_weight` int(11) DEFAULT '1',
  PRIMARY KEY (`recipe_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1, 'Chicken Noodle Soup', '/images/chicken_noodle_soup.jpg', 'Combine ingredients into pot#Boil and stir till cooked#Serve warm', 0, 1, 1, 0, 6),
(2, 'Chip n Beans', '/images/bean_salsa.jpg', 'Boil beans in pot.#Serve warm with chips.', 0, 1, 1, 1, 2),
(4, 'Chicken Pot Pie', '/images/chicken_pot_pie.jpg', 'Heat the oven to 400°F.  Stir the soup, 1/2 cup milk, vegetables and chicken in a 9-inch pie plate.#Stir the remaining 1/2 cup milk, egg and baking mix in a small bowl.  Spread the batter over the chicken mixture (the batter is thin but will bake up into a perfect crust).#Bake for 20 minutes or until the topping is golden brown.', 0, 1, 5, 0, 10),
(5, 'Tuna Casserole', '/images/1554177436001.jpg', 'Bring a large pot of water to a boil.#Add noodles and frozen peas.#Cook until noodles are al dente, drain well.#Return noodles and peas to the pot.#Mix soup, tuna fish, onions, processed cheese and pepper into the pot.#Stir constantly until all of the ingredients are well mixed and the cheese has melted. Serve.', 0, 1, 5, 0, 8),
(6, 'Tuna Melt', '/images/1554177393883.jpg', 'Preheat oven to 350 degrees F (175 degrees C).#In a mixing bowl, combine sweet onion, drained tuna, mozzarella, and mayonnaise. Mix thoroughly.#Spread tuna mixture on slices of French bread to form a sandwich. Place sandwiches on a cookie sheet.#Bake in a preheated oven for 10 minutes.', 0, 1, 5, 0, 10),
(7, 'Black Bean Salsa', '/images/bean_salsa.jpg', 'In a large bowl combine the black beans, corn, and salsa.#Let it sit for 30 minutes.# Serve', 0, 1, 5, 0, 6),
(8, 'Black Bean Chili', '/images/1554177341501.jpg', 'Heat the oil in a large heavy pot over medium heat.#cook onion and garlic until onions are translucent.#Add turkey and cook, stirring, until meat is brown. Stir in beans, tomatoes, chili powder, oregano, basil and vinegar.#Reduce heat to low, cover and simmer 60 minutes or more, until flavors are well blended.', 0, 1, 10, 0, 11);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `username` varchar(32) DEFAULT NULL,
  `user_password` text,
  `user_email` tinytext,
  `pantry_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` enum('Volunteer','Administrator') DEFAULT 'Volunteer',
  PRIMARY KEY (`user_id`),
  KEY `pantry_id` (`pantry_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`pantry_id`) REFERENCES `pantry` (`pantry_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('test','test','test@test.com',1,4,'Volunteer'),('admin','$2a$10$qotOtv0VfegBp36/muW9neIGJYPmv470PYR7oS11.Lrjwo/WUkd1y','et8492@wayne.edu',1,9,'Volunteer'),('admin','$2a$10$S5tTpwlmQEQY03U.G1mpbOWjU9wPGtApKX9RyiDMdc.gvQeWjJrsO','et8492@wayne.edu',1,10,'Volunteer'),('quastan@live.com','$2a$10$R0/SpFJOHHUyKiz5Yzy4xeUv33cgbdQ.bboHuY1Vl.4v8FiFpnh8W','quastan@live.com',1,11,'Administrator'),('admin','$2a$10$wRudyksT/2MCVOcj4TctVu5QrJg4gUlLQWKsTyJ8HDc5PYMBvHBsC','jenna291991@gmail.com',3,12,'Volunteer'),('admin','$2a$10$Zg3f7FieL/J6Ch9hHefSYuJ.e6PDZIJmiLk3oLRl0Xqm35ctsiZS6','pat9592@yahoo.com',8,15,'Volunteer'),('quastan@live.com','$2a$10$DOl83/1nofHtU/auUA4J6esckvkCOZt9qfgNJQxHE4E/rhgZHn0B6','quastan@live.com',1,16,'Volunteer'),('quastan@live.com','$2a$10$86EfDlHxR.Bw/Ki/5E1.SezL6DoSL.RR7UvGQtu9Z7yz/8qxSykS.','quastan@live.com',1,17,'Administrator'),('thisis@test.com','$2a$10$pOhWQpNZGnXPoSaAMQ0reuE0bx5MhlabdenGwkcT0gv03YbmkfRza','thisis@test.com',1,18,'Administrator'),('quastan@live.com','$2a$10$.hktGT/xusiDZoIRCYGDvukz/UoRw6AGhXa87RqmvXwpq4BhPr75S','quastan@live.com',1,19,'Administrator'),('admin','$2a$10$Un4KynrwZ38dqoKC5Wk2/uyvR6BW0ggrmckI8upbuyIYSfDELpo2a','pat9592@yahoo.com',9,20,'Volunteer'),('admin', '$2a$10$GpPtEiSt4V4v9QqQDpb8luATg3LdTc4oJi0Ml33RzNHbuxs82hNNy', 'test@wayne.edu', 1, 21, 'Administrator');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-01  1:30:06
>>>>>>> development:PANTRY_DB_FULL.sql
