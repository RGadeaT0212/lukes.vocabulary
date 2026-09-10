const SUPABASE_BASE_URL = "https://ylhjsbeliblhzkquxjss.supabase.co/storage/v1/object/public/vocabulary-pics";

// ==========================================================================
// 1. TAXONOMÍA OFICIAL
// ==========================================================================
export const VOCAB_TAXONOMY = {
    syntax: {
        noun: "noun", proper_noun: "proper_noun", verb: "verb", adjective: "adjective",
        pronoun: "pronoun", adverb: "adverb", preposition: "preposition", number: "number",
        expression: "expression"
    },
    category: {
        fruit: "fruit", vegetable: "vegetable", food_prepared: "food_prepared",
        drink: "drink", clothing_basic: "clothing_basic", personal_object: "personal_object",
        device: "device", house_part: "house_part", color_basic: "color_basic",
        animal: "animal", kitchen_utensil: "kitchen_utensil", food_secondary: "food_secondary",
        clothing_advanced: "clothing_advanced", city_place: "city_place", transport: "transport",
        appliance: "appliance", hygiene: "hygiene", color_advanced: "color_advanced",
        nature: "nature", body_part: "body_part", job: "job", travel: "travel",
        social_gesture: "social_gesture", reaction: "reaction", physical_need: "physical_need",
        daily_issue: "daily_issue", emotion_visible: "emotion_visible", city_action: "city_action",
        dimension: "dimension", physical_state: "physical_state", evaluation: "evaluation",
        frequency: "frequency", time_adv: "time_adv", intensity: "intensity",
        quantity_adv: "quantity_adv", limiter: "limiter", preposition_place: "preposition_place",
        condition: "condition", texture: "texture", weight: "weight", ambience: "ambience",
        manner: "manner", direction: "direction", numbers_basic: "numbers_basic",
        numbers_advanced: "numbers_advanced", personal_data: "personal_data"
    }
};

// ==========================================================================
// 2. PATRONES GRAMATICALES O(1)
// ==========================================================================
export const GRAMMAR_PATTERNS = {
    P_WHAT_IS_YOUR: { id: "P_WHAT_IS_YOUR", level: "A1", template_question: "What is your {placeholder}?" },
    P_CAN_I_HAVE: { id: "P_CAN_I_HAVE", level: "A1", template_request: "Can I have {qty} {placeholder:smart_plural}, please?" },
    P_I_NEED: { id: "P_I_NEED", level: "A1", template_request: "I need {article:smart} {placeholder}, please." },
    P_WHERE_IS: { id: "P_WHERE_IS", level: "A1", template_question: "Where is {article:smart} {placeholder}?" },
    P_REPORT_STATE: { id: "P_REPORT_STATE", level: "A2", template_statement: "My {item} is {state}." },
    P_DONT_UNDERSTAND: { id: "P_DONT_UNDERSTAND", level: "A1", template_statement: "I don't understand, please {placeholder}." }
};

// ==========================================================================
// 3. RAW_VOCABULARIO (Súper limpio: 7 Columnas)
// ==========================================================================
export const RAW_VOCABULARIO = [
    [1, "Hello", "Hola", "Greetings", "social_gesture", 1, false],
    [2, "Hi", "Hola", "Greetings", "social_gesture", 1, false],
    [3, "Good bye", "Adiós", "Greetings", "social_gesture", 1, false],
    [4, "Bye", "Adiós", "Greetings", "social_gesture", 1, false],
    [5, "See you later", "Hasta luego", "Greetings", "social_gesture", 1, false],

    [6, "Good morning", "Buenos días", "Courtesy Greetings", "social_gesture", 1, false],
    [7, "Good afternoon", "Buenas tardes", "Courtesy Greetings", "social_gesture", 1, false],
    [8, "Good evening", "Buenas noches", "Courtesy Greetings", "social_gesture", 1, false],
    [9, "Thank you", "Gracias", "Courtesy Greetings", "social_gesture", 1, false],
    [10, "You're welcome", "De nada", "Courtesy Greetings", "social_gesture", 1, false],

    [11, "Yes", "Sí", "Basic Responses", "social_gesture", 1, false],
    [12, "No", "No", "Basic Responses", "social_gesture", 1, false],
    [13, "Excuse me", "Disculpe", "Basic Responses", "social_gesture", 1, false],
    [14, "I'm sorry", "Lo siento", "Basic Responses", "social_gesture", 1, false],
    [15, "Please", "Por favor", "Basic Responses", "social_gesture", 1, false],

    [16, "Name", "Nombre", "Personal Info", "personal_data", 1, false],
    [17, "Last name", "Apellido", "Personal Info", "personal_data", 1, false],
    [18, "Age", "Edad", "Personal Info", "personal_data", 1, false],
    [19, "Nationality", "Nacionalidad", "Personal Info", "personal_data", 1, false],
    [20, "Profession", "Profesión", "Personal Info", "job", 1, false],

    [21, "Country", "País", "Living Places", "city_place", 1, true],
    [22, "City", "Ciudad", "Living Places", "city_place", 1, true],
    [23, "Neighborhood", "Vecindario", "Living Places", "city_place", 1, true],
    [24, "House", "Casa", "Living Places", "house_part", 1, true],
    [25, "Apartment", "Apartamento", "Living Places", "house_part", 1, true],

    [26, "Father", "Papá", "Close Family", "personal_data", 1, true],
    [27, "Mother", "Mamá", "Close Family", "personal_data", 1, true],
    [28, "Sister", "Hermana", "Close Family", "personal_data", 1, true],
    [29, "Brother", "Hermano", "Close Family", "personal_data", 1, true],
    [30, "Baby", "Bebé", "Close Family", "personal_data", 1, true],

    [31, "Grandma", "Abuela", "Extended Family", "personal_data", 1, true],
    [32, "Grandpa", "Abuelo", "Extended Family", "personal_data", 1, true],
    [33, "Aunt", "Tía", "Extended Family", "personal_data", 1, true],
    [34, "Uncle", "Tío", "Extended Family", "personal_data", 1, true],
    [35, "Cousin", "Primo/a", "Extended Family", "personal_data", 1, true],

    [36, "Zero", "Cero", "Basic Numbers 1", "numbers_basic", 1, false],
    [37, "One", "Uno", "Basic Numbers 1", "numbers_basic", 1, false],
    [38, "Two", "Dos", "Basic Numbers 1", "numbers_basic", 1, false],
    [39, "Three", "Tres", "Basic Numbers 1", "numbers_basic", 1, false],
    [40, "Four", "Cuatro", "Basic Numbers 1", "numbers_basic", 1, false],

    [41, "Five", "Cinco", "Basic Numbers 2", "numbers_basic", 1, false],
    [42, "Six", "Seis", "Basic Numbers 2", "numbers_basic", 1, false],
    [43, "Seven", "Siete", "Basic Numbers 2", "numbers_basic", 1, false],
    [44, "Eight", "Ocho", "Basic Numbers 2", "numbers_basic", 1, false],
    [45, "Nine", "Nueve", "Basic Numbers 2", "numbers_basic", 1, false],

    [46, "Red", "Rojo", "Basic Colors 1", "color_basic", 1, true],
    [47, "Blue", "Azul", "Basic Colors 1", "color_basic", 1, true],
    [48, "Yellow", "Amarillo", "Basic Colors 1", "color_basic", 1, true],
    [49, "Purple", "Morado", "Basic Colors 1", "color_basic", 1, true],
    [50, "Black", "Negro", "Basic Colors 1", "color_basic", 1, true],

    [51, "White", "Blanco", "Basic Colors 2", "color_basic", 1, true],
    [52, "Orange", "Naranja", "Basic Colors 2", "color_basic", 1, true],
    [53, "Green", "Verde", "Basic Colors 2", "color_basic", 1, true],
    [54, "Gray", "Gris", "Basic Colors 2", "color_basic", 1, true],
    [55, "Pink", "Rosa", "Basic Colors 2", "color_basic", 1, true],

    [56, "Short", "Bajo/a", "Physical Traits 1", "dimension", 1, true],
    [57, "Tall", "Alto/a", "Physical Traits 1", "dimension", 1, true],
    [58, "Beautiful", "Hermoso/a", "Physical Traits 1", "evaluation", 1, true],
    [59, "Ugly", "Feo/a", "Physical Traits 1", "evaluation", 1, true],
    [60, "Big", "Grande", "Physical Traits 1", "dimension", 1, true],

    [61, "Small", "Pequeño/a", "Physical Traits 2", "dimension", 1, true],
    [62, "Clean", "Limpio/a", "Physical Traits 2", "physical_state", 1, true],
    [63, "Dirty", "Sucio/a", "Physical Traits 2", "physical_state", 1, true],
    [64, "Large", "Amplio/a", "Physical Traits 2", "dimension", 1, true],
    [65, "Long", "Largo/a", "Physical Traits 2", "dimension", 1, true],

    [66, "Hand", "Mano", "Body Parts 1", "body_part", 1, true],
    [67, "Face", "Cara", "Body Parts 1", "body_part", 1, true],
    [68, "Foot", "Pie", "Body Parts 1", "body_part", 1, true],
    [69, "Eye", "Ojo", "Body Parts 1", "body_part", 1, true],
    [70, "Finger", "Dedo de la mano", "Body Parts 1", "body_part", 1, true],

    [71, "Nose", "Nariz", "Body Parts 2", "body_part", 1, true],
    [72, "Hair", "Cabello", "Body Parts 2", "body_part", 1, true],
    [73, "Tooth", "Diente", "Body Parts 2", "body_part", 1, true],
    [74, "Leg", "Pierna", "Body Parts 2", "body_part", 1, true],
    [75, "Head", "Cabeza", "Body Parts 2", "body_part", 1, true],

    [76, "Door", "Puerta", "House Structure 1", "house_part", 2, true],
    [77, "Window", "Ventana", "House Structure 1", "house_part", 2, true],
    [78, "Wall", "Pared", "House Structure 1", "house_part", 2, true],
    [79, "Floor", "Piso", "House Structure 1", "house_part", 2, true],
    [80, "Ceiling", "Techo interior", "House Structure 1", "house_part", 2, true],

    // Bloque 2: Estructura de la casa 2 y espacios
    [81, "Roof", "Tejado", "House Structure 2", "house_part", 2, true],
    [82, "Bedroom", "Habitación", "House Structure 2", "house_part", 2, true],
    [83, "Living room", "Sala de estar", "House Structure 2", "house_part", 2, true],
    [84, "Garden", "Jardín", "House Structure 2", "house_part", 2, true],
    [85, "Balcony", "Balcón", "House Structure 2", "house_part", 2, true],

    // Bloque 3: Muebles del hogar 1
    [86, "Garage", "Cochera", "Home Furniture 1", "house_part", 2, true],
    [87, "Hallway", "Pasillo", "Home Furniture 1", "house_part", 2, true],
    [88, "Bed", "Cama", "Home Furniture 1", "house_part", 2, true],
    [89, "Table", "Mesa", "Home Furniture 1", "house_part", 2, true],
    [90, "Chair", "Silla", "Home Furniture 1", "house_part", 2, true],

    // Bloque 4: Muebles del hogar 2
    [91, "Sofa", "Sofá", "Home Furniture 2", "house_part", 2, true],
    [92, "Desk", "Escritorio", "Home Furniture 2", "house_part", 2, true],
    [93, "Closet", "Armario", "Home Furniture 2", "house_part", 2, true],
    [94, "Shelf", "Estante", "Home Furniture 2", "house_part", 2, true],
    [95, "Carpet", "Alfombra", "Home Furniture 2", "house_part", 2, true],

    // Bloque 5: Accesorios de habitación
    [96, "Pillow", "Almohada", "Bedroom Items", "house_part", 2, true],
    [97, "Blanket", "Manta", "Bedroom Items", "house_part", 2, true],
    [98, "Mirror", "Espejo", "Bedroom Items", "house_part", 2, true],
    [99, "Curtain", "Cortina", "Bedroom Items", "house_part", 2, true],
    [100, "Kitchen", "Cocina", "Bedroom Items", "house_part", 2, true],

    // Bloque 6: Electrodomésticos de cocina
    [101, "Fridge", "Nevera", "Kitchen Essentials", "appliance", 2, true],
    [102, "Stove", "Estufa", "Kitchen Essentials", "appliance", 2, true],
    [103, "Oven", "Horno", "Kitchen Essentials", "appliance", 2, true],
    [104, "Sink", "Fregadero", "Kitchen Essentials", "kitchen_utensil", 2, true],
    [105, "Plate", "Plato", "Kitchen Essentials", "kitchen_utensil", 2, true],

    // Bloque 7: Utensilios de cocina
    [106, "Glass", "Vaso", "Kitchenware", "kitchen_utensil", 2, true],
    [107, "Cup", "Taza", "Kitchenware", "kitchen_utensil", 2, true],
    [108, "Fork", "Tenedor", "Kitchenware", "kitchen_utensil", 2, true],
    [109, "Spoon", "Cuchara", "Kitchenware", "kitchen_utensil", 2, true],
    [110, "Knife", "Cuchillo", "Kitchenware", "kitchen_utensil", 2, true],

    // Bloque 8: Recipientes y cocina
    [111, "Pan", "Sartén", "Cookware", "kitchen_utensil", 2, true],
    [112, "Pot", "Olla", "Cookware", "kitchen_utensil", 2, true],
    [113, "Bottle", "Botella", "Cookware", "kitchen_utensil", 2, true],
    [114, "Bathroom", "Baño", "Cookware", "house_part", 2, true],
    [115, "Towel", "Toalla", "Cookware", "hygiene", 2, true],

    // Bloque 9: Aseo personal
    [116, "Soap", "Jabón", "Bathroom & Hygiene", "hygiene", 2, true],
    [117, "Shampoo", "Champú", "Bathroom & Hygiene", "hygiene", 2, true],
    [118, "Toothbrush", "Cepillo de dientes", "Bathroom & Hygiene", "hygiene", 2, true],
    [119, "Toilet paper", "Papel higiénico", "Bathroom & Hygiene", "hygiene", 2, true],
    [120, "Comb", "Peine", "Bathroom & Hygiene", "hygiene", 2, true],

    // Bloque 10: Ropa superior
    [121, "Shirt", "Camisa", "Basic Clothing 1", "clothing_basic", 2, true],
    [122, "T-shirt", "Camiseta", "Basic Clothing 1", "clothing_basic", 2, true],
    [123, "Pants", "Pantalones", "Basic Clothing 1", "clothing_basic", 2, true],
    [124, "Shorts", "Pantalones cortos", "Basic Clothing 1", "clothing_basic", 2, true],
    [125, "Jeans", "Vaqueros", "Basic Clothing 1", "clothing_basic", 2, true],

    // Bloque 11: Ropa variada
    [126, "Dress", "Vestido", "Basic Clothing 2", "clothing_basic", 2, true],
    [127, "Skirt", "Falda", "Basic Clothing 2", "clothing_basic", 2, true],
    [128, "Jacket", "Chaqueta", "Basic Clothing 2", "clothing_basic", 2, true],
    [129, "Coat", "Abrigo", "Basic Clothing 2", "clothing_basic", 2, true],
    [130, "Sweater", "Suéter", "Basic Clothing 2", "clothing_basic", 2, true],

    // Bloque 12: Calzado
    [131, "Socks", "Calcetines", "Footwear", "clothing_basic", 2, true],
    [132, "Shoes", "Zapatos", "Footwear", "clothing_basic", 2, true],
    [133, "Boots", "Botas", "Footwear", "clothing_basic", 2, true],
    [134, "Sneakers", "Tenis", "Footwear", "clothing_basic", 2, true],
    [135, "Sandals", "Sandalias", "Footwear", "clothing_basic", 2, true],

    // Bloque 13: Accesorios personales 1
    [136, "Key", "Llave", "Personal Belongings 1", "personal_object", 2, true],
    [137, "Wallet", "Billetera", "Personal Belongings 1", "personal_object", 2, true],
    [138, "Purse", "Bolso", "Personal Belongings 1", "personal_object", 2, true],
    [139, "Umbrella", "Paraguas", "Personal Belongings 1", "personal_object", 2, true],
    [140, "Glasses", "Gafas", "Personal Belongings 1", "personal_object", 2, true],

    // Bloque 14: Accesorios personales 2
    [141, "Sunglasses", "Gafas de sol", "Personal Belongings 2", "personal_object", 2, true],
    [142, "Belt", "Cinturón", "Personal Belongings 2", "clothing_basic", 2, true],
    [143, "Hat", "Sombrero", "Personal Belongings 2", "clothing_basic", 2, true],
    [144, "Cap", "Gorra", "Personal Belongings 2", "clothing_basic", 2, true],
    [145, "Watch", "Reloj de pulsera", "Personal Belongings 2", "device", 2, true],

    // Bloque 15: Joyas y objetos cotidianos
    [146, "Ring", "Anillo", "Accessories & Daily Objects", "personal_object", 2, true],
    [147, "Necklace", "Collar", "Accessories & Daily Objects", "personal_object", 2, true],
    [148, "Money", "Dinero", "Accessories & Daily Objects", "personal_object", 2, true],
    [149, "Bag", "Mochila / Bolsa", "Accessories & Daily Objects", "personal_object", 2, true],
    [150, "Microwave", "Microondas", "Accessories & Daily Objects", "appliance", 2, true],

    // Bloque 16: Dispositivos y aparatos
    [151, "Lamp", "Lámpara", "Home Electronics", "appliance", 2, true],
    [152, "Clock", "Reloj de pared", "Home Electronics", "appliance", 2, true],
    [153, "Fan", "Ventilador", "Home Electronics", "appliance", 2, true],
    [154, "TV", "Televisor", "Home Electronics", "device", 2, true],
    [155, "Phone", "Teléfono", "Home Electronics", "device", 2, true],

    // Bloque 17: Utensilios y mantenimiento
    [156, "Charger", "Cargador", "Maintenance & Tools", "device", 2, true],
    [157, "Iron", "Plancha", "Maintenance & Tools", "appliance", 2, true],
    [158, "Washer", "Lavadora", "Maintenance & Tools", "appliance", 2, true],
    [159, "Broom", "Escoba", "Maintenance & Tools", "personal_object", 2, true],
    [160, "Trash can", "Cubo de basura", "Maintenance & Tools", "personal_object", 2, true],
    // Bloque 17: Utensilios y mantenimiento
    [161, "Key", "Llave", "Daily Items & Cleaning", "personal_object", 2, true],
    [162, "Comb", "Peine", "Daily Items & Cleaning", "hygiene", 2, true],
    [163, "Needle", "Aguja", "Daily Items & Cleaning", "personal_object", 2, true],
    [164, "Thread", "Hilo", "Daily Items & Cleaning", "personal_object", 2, true],
    [165, "Bucket", "Balde", "Daily Items & Cleaning", "personal_object", 2, true],

    // Bloque 19: Herramientas de mantenimiento y acción
    [166, "Tray", "Bandeja", "Maintenance & Action", "kitchen_utensil", 2, true],
    [167, "Pitcher", "Jarra", "Maintenance & Action", "kitchen_utensil", 2, true],
    [168, "Napkin", "Servilleta", "Maintenance & Action", "kitchen_utensil", 2, true],
    [169, "Mattress", "Colchón", "Maintenance & Action", "house_part", 2, true],
    [170, "Clean", "Limpiar", "Maintenance & Action", "daily_issue", 2, true],

// Bloque 1: Rutinas de la mañana y tarde
    [171, "Wake up", "Levantarse / Despertar", "Morning Routine", "city_action", 3, true],
    [172, "Shower", "Ducharse / Bañarse", "Morning Routine", "city_action", 3, true],
    [173, "Eat breakfast", "Desayunar", "Morning Routine", "city_action", 3, true],
    [174, "Work", "Trabajar", "Morning Routine", "city_action", 3, true],
    [175, "Study", "Estudiar", "Morning Routine", "city_action", 3, true],

    // Bloque 2: Rutinas de la tarde y noche
    [176, "Eat lunch", "Almorzar", "Evening Routine", "city_action", 3, true],
    [177, "Return", "Regresar / Volver", "Evening Routine", "city_action", 3, true],
    [178, "Rest", "Descansar", "Evening Routine", "city_action", 3, true],
    [179, "Eat dinner", "Cenar", "Evening Routine", "city_action", 3, true],
    [180, "Go to bed", "Acostarse / Ir a la cama", "Evening Routine", "city_action", 3, true],

    // Bloque 3: Frecuencia y momentos del día
    [181, "Always", "Siempre", "Frequency & Time", "frequency", 3, false],
    [182, "Usually", "Normalmente", "Frequency & Time", "frequency", 3, false],
    [183, "Sometimes", "A veces", "Frequency & Time", "frequency", 3, false],
    [184, "Never", "Nunca", "Frequency & Time", "frequency", 3, false],
    [185, "Every day", "Todos los días", "Frequency & Time", "time_adv", 3, false],

    // Bloque 1: Frutas principales
    [186, "Apple", "Manzana", "Fruits", "fruit", 4, true],
    [187, "Banana", "Plátano", "Fruits", "fruit", 4, true],
    [188, "Orange", "Naranja", "Fruits", "fruit", 4, true],
    [189, "Lemon", "Limón", "Fruits", "fruit", 4, true],
    [190, "Grape", "Uva", "Fruits", "fruit", 4, true],

    // Bloque 2: Verduras y vegetales
    [191, "Potato", "Patata", "Vegetables", "vegetable", 4, true],
    [192, "Tomato", "Tomate", "Vegetables", "vegetable", 4, true],
    [193, "Onion", "Cebolla", "Vegetables", "vegetable", 4, true],
    [194, "Carrot", "Zanahoria", "Vegetables", "vegetable", 4, true],
    [195, "Garlic", "Ajo", "Vegetables", "vegetable", 4, true],

    // Bloque 3: Carnes y proteínas
    [196, "Meat", "Carne", "Meats & Proteins", "food_prepared", 4, true],
    [197, "Chicken", "Pollo", "Meats & Proteins", "food_prepared", 4, true],
    [198, "Beef", "Carne de res", "Meats & Proteins", "food_prepared", 4, true],
    [199, "Pork", "Carne de cerdo", "Meats & Proteins", "food_prepared", 4, true],
    [200, "Fish", "Pescado", "Meats & Proteins", "food_prepared", 4, true],

    // Bloque 4: Alimentos básicos y acompañamientos
    [201, "Bread", "Pan", "Staple Foods", "food_prepared", 4, true],
    [202, "Rice", "Arroz", "Staple Foods", "food_prepared", 4, true],
    [203, "Cheese", "Queso", "Staple Foods", "food_prepared", 4, true],
    [204, "Egg", "Huevo", "Staple Foods", "food_prepared", 4, true],
    [205, "Soup", "Sopa", "Staple Foods", "food_prepared", 4, true],

    // Bloque 5: Bebidas cotidianas
    [206, "Water", "Agua", "Beverages", "drink", 4, true],
    [207, "Coffee", "Café", "Beverages", "drink", 4, true],
    [208, "Tea", "Té", "Beverages", "drink", 4, true],
    [209, "Milk", "Leche", "Beverages", "drink", 4, true],
    [210, "Juice", "Jugo / Zumo", "Beverages", "drink", 4, true],

    // Bloque 6: Comidas del día y menú
    [211, "Breakfast", "Desayuno", "Meals & Dining", "food_prepared", 4, true],
    [212, "Lunch", "Almuerzo", "Meals & Dining", "food_prepared", 4, true],
    [213, "Dinner", "Cena", "Meals & Dining", "food_prepared", 4, true],
    [214, "Snack", "Merienda / Bocado", "Meals & Dining", "food_prepared", 4, true],
    [215, "Menu", "Menú / Carta", "Meals & Dining", "personal_object", 4, true],

    // Bloque 7: Sabores y condimentos
    [216, "Sugar", "Azúcar", "Flavors & Condiments", "food_secondary", 4, true],
    [217, "Salt", "Sal", "Flavors & Condiments", "food_secondary", 4, true],
    [218, "Sweet", "Dulce", "Flavors & Condiments", "evaluation", 4, true],
    [219, "Salty", "Salado", "Flavors & Condiments", "evaluation", 4, true],
    [220, "Spicy", "Picante", "Flavors & Condiments", "evaluation", 4, true],

    // Bloque 8: Necesidades físicas y acciones de consumo
    [221, "Hungry", "Hambriento / Con hambre", "Physical Needs", "physical_need", 4, false],
    [222, "Thirsty", "Sediento / Con sed", "Physical Needs", "physical_need", 4, false],
    [223, "Eat", "Comer", "Physical Needs", "city_action", 4, true],
    [224, "Drink", "Beber / Tomar", "Physical Needs", "city_action", 4, true],
    [225, "Order", "Pedir / Ordenar", "Physical Needs", "city_action", 4, true],

// Bloque 1: Servicios esenciales de la ciudad
    [226, "Street", "Calle", "City Places 1", "city_place", 5, true],
    [227, "Bank", "Banco", "City Places 1", "city_place", 5, true],
    [228, "Supermarket", "Supermercado", "City Places 1", "city_place", 5, true],
    [229, "Pharmacy", "Farmacia", "City Places 1", "city_place", 5, true],
    [330, "Hospital", "Hospital", "City Places 1", "city_place", 5, true],

    // Bloque 2: Lugares de interés y transporte
    [231, "Restaurant", "Restaurante", "City Places 2", "city_place", 5, true],
    [232, "Hotel", "Hotel", "City Places 2", "city_place", 5, true],
    [233, "Station", "Estación", "City Places 2", "city_place", 5, true],
    [234, "Airport", "Aeropuerto", "City Places 2", "city_place", 5, true],
    [235, "School", "Escuela / Colegio", "City Places 2", "city_place", 5, true],

    // Bloque 3: Direcciones y orientaciones
    [236, "Left", "Izquierda", "Directions & Orientation", "direction", 5, true],
    [237, "Right", "Derecha", "Directions & Orientation", "direction", 5, true],
    [238, "In front", "Delante / Al frente", "Directions & Orientation", "preposition_place", 5, false],
    [239, "Behind", "Detrás", "Directions & Orientation", "preposition_place", 5, false],
    [240, "Next to", "Al lado de", "Directions & Orientation", "preposition_place", 5, false],

    // Bloque 4: Proximidad y ubicación relativa
    [241, "Near", "Cerca", "Proximity & Relative Position", "preposition_place", 5, false],
    [242, "Far", "Lejos", "Proximity & Relative Position", "preposition_place", 5, false],
    [243, "Opposite", "Enfrente de", "Proximity & Relative Position", "preposition_place", 5, false],
    [244, "Between", "Entre", "Proximity & Relative Position", "preposition_place", 5, false],
    [245, "Corner", "Esquina", "Proximity & Relative Position", "city_place", 5, true],

// Bloque 1: Divisiones del tiempo y horas
    [246, "Day", "Día", "Time & Dates 1", "time_adv", 6, true],
    [247, "Month", "Mes", "Time & Dates 1", "time_adv", 6, true],
    [248, "Season", "Estación del año", "Time & Dates 1", "time_adv", 6, true],
    [249, "Hour", "Hora", "Time & Dates 1", "time_adv", 6, true],
    [250, "Date", "Fecha", "Time & Dates 1", "time_adv", 6, false],

    // Bloque 2: Puntos de referencia temporal
    [251, "Today", "Hoy", "Time Markers", "time_adv", 6, false],
    [252, "Tomorrow", "Mañana", "Time Markers", "time_adv", 6, false],
    [253, "Yesterday", "Ayer", "Time Markers", "time_adv", 6, false],
    [254, "Now", "Ahora", "Time Markers", "time_adv", 6, false],
    [255, "Later", "Después / Más tarde", "Time Markers", "time_adv", 6, false],

    // Bloque 3: Días de la semana 1
    [256, "Monday", "Lunes", "Days of the Week 1", "time_adv", 6, false],
    [257, "Tuesday", "Martes", "Days of the Week 1", "time_adv", 6, false],
    [258, "Wednesday", "Miércoles", "Days of the Week 1", "time_adv", 6, false],
    [259, "Thursday", "Jueves", "Days of the Week 1", "time_adv", 6, false],
    [260, "Friday", "Viernes", "Days of the Week 1", "time_adv", 6, false],

    // Bloque 4: Fin de semana y momentos del día
    [261, "Saturday", "Sábado", "Days & Moments", "time_adv", 6, false],
    [262, "Sunday", "Domingo", "Days & Moments", "time_adv", 6, false],
    [263, "Weekend", "Fin de semana", "Days & Moments", "time_adv", 6, true],
    [264, "Morning", "Mañana (momento)", "Days & Moments", "time_adv", 6, true],
    [265, "Night", "Noche", "Days & Moments", "time_adv", 6, true],

    // Bloque 5: Fenómenos del clima
    [266, "Rain", "Lluvia", "Weather Elements", "nature", 6, true],
    [267, "Sun", "Sol", "Weather Elements", "nature", 6, true],
    [268, "Wind", "Viento", "Weather Elements", "nature", 6, true],
    [269, "Snow", "Nieve", "Weather Elements", "nature", 6, true],
    [270, "Cloud", "Nube", "Weather Elements", "nature", 6, true],

    // Bloque 6: Sensaciones térmicas y temperatura
    [271, "Cold", "Frío", "Temperature & Atmosphere", "physical_state", 6, true],
    [272, "Hot", "Calor / Caluroso", "Temperature & Atmosphere", "physical_state", 6, true],
    [273, "Warm", "Cálido / Templado", "Temperature & Atmosphere", "physical_state", 6, true],
    [274, "Cool", "Fresco", "Temperature & Atmosphere", "physical_state", 6, true],
    [275, "Weather", "Clima / Tiempo atmosférico", "Temperature & Atmosphere", "ambience", 6, true],

    // Bloque 7: Estaciones del año
    [276, "Spring", "Primavera", "Seasons of the Year", "nature", 6, true],
    [277, "Summer", "Verano", "Seasons of the Year", "nature", 6, true],
    [278, "Autumn", "Otoño", "Seasons of the Year", "nature", 6, true],
    [279, "Winter", "Invierno", "Seasons of the Year", "nature", 6, true],
    [280, "Storm", "Tormenta", "Seasons of the Year", "nature", 6, true],

// Bloque 1: Artículos de compra y tallas
    [281, "Clothes", "Ropa", "Shopping & Sizes", "clothing_basic", 7, true],
    [282, "Shoes", "Zapatos", "Shopping & Sizes", "clothing_basic", 7, true],
    [283, "Size", "Talla / Tamaño", "Shopping & Sizes", "clothing_basic", 7, false],
    [284, "Store", "Tienda", "Shopping & Sizes", "city_place", 7, true],
    [285, "Customer", "Cliente / Comprador", "Shopping & Sizes", "personal_data", 7, true],

    // Bloque 2: Dinero, valores y métodos de pago
    [286, "Money", "Dinero", "Money & Payment", "personal_object", 7, true],
    [287, "Price", "Precio", "Money & Payment", "numbers_basic", 7, false],
    [288, "Cheap", "Barato / Económico", "Money & Payment", "evaluation", 7, false],
    [289, "Expensive", "Caro / Costoso", "Money & Payment", "evaluation", 7, false],
    [290, "Cash", "Efectivo / Dinero en metálico", "Money & Payment", "personal_object", 7, true],

    // Bloque 3: Documentos de compra y transacciones
    [291, "Card", "Tarjeta (crédito/débito)", "Transactions & Receipts", "personal_object", 7, true],
    [292, "Receipt", "Recibo / Tique", "Transactions & Receipts", "personal_object", 7, true],
    [293, "Discount", "Descuento / Rebaja", "Transactions & Receipts", "evaluation", 7, false],
    [294, "Change", "Cambio / Vueltas", "Transactions & Receipts", "personal_object", 7, false],
    [295, "Total", "Total / Suma", "Transactions & Receipts", "numbers_basic", 7, false],

    // Bloque 4: Verbos y funciones de comercio
    [296, "Buy", "Comprar", "Shopping Actions", "city_action", 7, true],
    [297, "Sell", "Vender", "Shopping Actions", "city_action", 7, true],
    [298, "Choose", "Elegir / Escoger", "Shopping Actions", "city_action", 7, true],
    [299, "Pay", "Pagar", "Shopping Actions", "city_action", 7, true],
    [300, "Return", "Devolver", "Shopping Actions", "city_action", 7, true],

// Bloque 1: Medios de transporte principales
    [301, "Car", "Coche / Auto", "Basic Transport 1", "transport", 8, true],
    [302, "Bus", "Autobús", "Basic Transport 1", "transport", 8, true],
    [303, "Train", "Tren", "Basic Transport 1", "transport", 8, true],
    [304, "Airplane", "Avión", "Basic Transport 1", "transport", 8, true],
    [305, "Taxi", "Taxi", "Basic Transport 1", "transport", 8, true],

    // Bloque 2: Transporte ligero y elementos de viaje
    [306, "Bicycle", "Bicicleta", "Basic Transport 2", "transport", 8, true],
    [307, "Ticket", "Boleto / Pasaje", "Basic Transport 2", "personal_object", 8, true],
    [308, "Luggage", "Equipaje / Maleta", "Basic Transport 2", "personal_object", 8, true],
    [309, "Trip", "Viaje", "Basic Transport 2", "travel", 8, false],
    [310, "Station", "Estación", "Basic Transport 2", "city_place", 8, true],

// Bloque 1: Actividades de entretenimiento
    [311, "Music", "Música", "Leisure & Entertainment", "personal_object", 9, true],
    [312, "Movie", "Película", "Leisure & Entertainment", "personal_object", 9, true],
    [313, "Television", "Televisión", "Leisure & Entertainment", "device", 9, true],
    [314, "Sports", "Deportes", "Leisure & Entertainment", "city_action", 9, true],
    [315, "Video games", "Videojuegos", "Leisure & Entertainment", "device", 9, true],

    // Bloque 2: Pasatiempos y acciones de ocio
    [316, "Book", "Libro", "Hobbies & Actions", "personal_object", 9, true],
    [317, "Go out", "Salir (de paseo/fiesta)", "Hobbies & Actions", "city_action", 9, true],
    [318, "Walk", "Caminar / Pasear", "Hobbies & Actions", "city_action", 9, true],
    [319, "Travel", "Viajar", "Hobbies & Actions", "city_action", 9, true],
    [320, "Read", "Leer", "Hobbies & Actions", "city_action", 9, true],


    // --- UNIDAD 10: Necesidades, Problemas y Emergencias ---

    // Bloque 1: Situaciones de urgencia
    [321, "Help", "Ayuda", "Problems & Urgent States", "daily_issue", 10, true],
    [322, "Problem", "Problema", "Problems & Urgent States", "daily_issue", 10, true],
    [323, "Lost", "Perdido/a", "Problems & Urgent States", "physical_state", 10, false],
    [324, "Broken", "Roto/a / Averiado", "Problems & Urgent States", "physical_state", 10, true],
    [325, "Tired", "Cansado/a", "Problems & Urgent States", "physical_need", 10, true],

    // Bloque 2: Salud y estados de riesgo
    [326, "Hungry", "Hambriento/a", "Health & Danger", "physical_need", 10, true],
    [327, "Thirsty", "Sediento/a", "Health & Danger", "physical_need", 10, true],
    [328, "Sick", "Enfermo/a", "Health & Danger", "physical_need", 10, true],
    [329, "Danger", "Peligro", "Health & Danger", "daily_issue", 10, true],
    [330, "Emergency", "Emergencia", "Health & Danger", "daily_issue", 10, true],

    // Bloque 3: Expresiones clave de auxilio y estado
    [331, "Help!", "¡Ayuda!", "Emergency Expressions 1", "social_gesture", 10, false],
    [332, "I need help", "Necesito ayuda", "Emergency Expressions 1", "social_gesture", 10, false],
    [333, "I don't know", "No sé / No lo sé", "Emergency Expressions 1", "social_gesture", 10, false],
    [334, "I can't find", "No puedo encontrar...", "Emergency Expressions 1", "social_gesture", 10, false],
    [335, "I have a problem", "Tengo un problema", "Emergency Expressions 1", "social_gesture", 10, false],

    // Bloque 4: Expresiones de malestar y consulta
    [336, "I don't feel well", "No me siento bien", "Emergency Expressions 2", "social_gesture", 10, false],
    [337, "Call the doctor", "Llame al médico", "Emergency Expressions 2", "social_gesture", 10, false],
    [338, "Where is the police?", "¿Dónde está la policía?", "Emergency Expressions 2", "social_gesture", 10, false],
    [339, "I lost my passport", "Perdí mi pasaporte", "Emergency Expressions 2", "social_gesture", 10, false],
    [340, "It's an emergency", "Es una emergencia", "Emergency Expressions 2", "social_gesture", 10, false],
    
];

// ==========================================================================
// 4. MAPEADOR INTELIGENTE (Procesa Links, Taxonomía y Patrones)
// ==========================================================================
export const VOCABULARY_DATABASE = RAW_VOCABULARIO.map(([id, word, spanish, topic, categoryKey, unit, hasImage]) => {

    // Conecta con VOCAB_TAXONOMY
    const category = VOCAB_TAXONOMY.category[categoryKey] || categoryKey;

    // Conecta con Supabase (Media Link)
    let mediaUrl = null;
    if (hasImage) {
        const cleanFileName = word.toLowerCase().replace(/'/g, '').trim().replace(/\s+/g, '-');
        mediaUrl = `${SUPABASE_BASE_URL}/${category}/${cleanFileName}.svg`;
    }

    // Calcula sintaxis
    let syntax = VOCAB_TAXONOMY.syntax.noun;
    if (categoryKey === "social_gesture") syntax = VOCAB_TAXONOMY.syntax.expression;
    else if (["color_basic", "dimension", "evaluation", "physical_state"].includes(categoryKey)) syntax = VOCAB_TAXONOMY.syntax.adjective;
    else if (categoryKey === "numbers_basic") syntax = VOCAB_TAXONOMY.syntax.number;

    // Conecta con GRAMMAR_PATTERNS
    let pattern_id = "P_DONT_UNDERSTAND";
    if (["personal_data", "color_basic", "numbers_basic"].includes(categoryKey)) pattern_id = "P_WHAT_IS_YOUR";
    else if (["city_place", "house_part"].includes(categoryKey)) pattern_id = "P_WHERE_IS";
    else if (["dimension", "evaluation", "physical_state"].includes(categoryKey)) pattern_id = "P_REPORT_STATE";
    else if (categoryKey === "body_part") pattern_id = "P_I_NEED";

    return {
        id,
        word,
        spanish,
        topic,
        category,
        unit,
        euroLevel: unit <= 5 ? "A1" : unit <= 10 ? "A2" : "B1",
        syntax,
        article: syntax === "noun" ? (['a', 'e', 'i', 'o', 'u'].includes(word.trim().toLowerCase()[0]) ? 'an' : 'a') : null,
        pattern_id,
        hasImage,
        media_url: mediaUrl
    };
});
