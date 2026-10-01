const SUPABASE_BASE_URL = "https://ylhjsbeliblhzkquxjss.supabase.co/storage/v1/object/public/vocabulary-pics/";

// ==========================================================================
// 1. TAXONOMÍA OFICIAL
// ==========================================================================
export const VOCAB_TAXONOMY = {
    syntax: {
        noun: "noun", proper_noun: "proper_noun", verb: "verb", adjective: "adjective",
        pronoun: "pronoun", adverb: "adverb", preposition: "preposition", number: "number"
    },
    category: {
        fruit: "fruit", vegetable: "vegetable", food_prepared: "food_prepared",
        drink: "drink", clothing_basic: "clothing_basic", personal_object: "personal_object",
        device: "device", house_part: "house_part", color_basic: "color_basic",
        kitchen_utensil: "kitchen_utensil", food_secondary: "food_secondary",
        city_place: "city_place", transport: "transport", appliance: "appliance",
        hygiene: "hygiene", nature: "nature", body_part: "body_part",
        dimension: "dimension", physical_state: "physical_state", evaluation: "evaluation",
        people: "people"
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
    P_REPORT_STATE: { id: "P_REPORT_STATE", level: "A2", template_statement: "My {item} is {state}." }
};

// ==========================================================================
// 3. RAW_VOCABULARIO ([ID, EN, ES, FR, PT, IT, DE, Topic, Category, Unit, hasImage])
// ==========================================================================
export const RAW_VOCABULARIO = [
    // --- GRUPO 1: Close Family (1 - 5) ---
    [1, "Father", "Papá", "Père", "Pai", "Padre", "Vater", "Close Family", "people", 1, true],
    [2, "Mother", "Mamá", "Mère", "Mãe", "Madre", "Mutter", "Close Family", "people", 1, true],
    [3, "Sister", "Hermana", "Sœur", "Irmã", "Sorella", "Schwester", "Close Family", "people", 1, true],
    [4, "Brother", "Hermano", "Frère", "Irmão", "Fratello", "Bruder", "Close Family", "people", 1, true],
    [5, "Baby", "Bebé", "Bébé", "Bebê", "Bambino", "Baby", "Close Family", "people", 1, true],

    // --- GRUPO 2: Extended Family (6 - 10) ---
    [6, "Grandma", "Abuela", "Grand-mère", "Avó", "Nonna", "Oma", "Extended Family", "people", 1, true],
    [7, "Grandpa", "Abuelo", "Grand-père", "Avô", "Nonno", "Opa", "Extended Family", "people", 1, true],
    [8, "Aunt", "Tía", "Tante", "Tia", "Zia", "Tante", "Extended Family", "people", 1, true],
    [9, "Uncle", "Tío", "Oncle", "Tio", "Zio", "Onkel", "Extended Family", "people", 1, true],
    [10, "Cousin", "Primo/a", "Cousin/e", "Primo/a", "Cugino/a", "Cousin/e", "Extended Family", "people", 1, true],

    // --- GRUPO 3: Basic Colors 1 (11 - 15) ---
    [11, "Red", "Rojo", "Rouge", "Vermelho", "Rosso", "Rot", "Basic Colors 1", "color_basic", 1, true],
    [12, "Blue", "Azul", "Bleu", "Azul", "Blu", "Blau", "Basic Colors 1", "color_basic", 1, true],
    [13, "Yellow", "Amarillo", "Jaune", "Amarelo", "Giallo", "Gelb", "Basic Colors 1", "color_basic", 1, true],
    [14, "Purple", "Morado", "Violet", "Roxo", "Viola", "Lila", "Basic Colors 1", "color_basic", 1, true],
    [15, "Black", "Negro", "Noir", "Preto", "Nero", "Schwarz", "Basic Colors 1", "color_basic", 1, true],

    // --- GRUPO 4: Basic Colors 2 (16 - 20) ---
    [16, "White", "Blanco", "Blanc", "Branco", "Bianco", "Weiß", "Basic Colors 2", "color_basic", 1, true],
    [17, "Orange", "Naranja", "Orange", "Laranja", "Arancione", "Orange", "Basic Colors 2", "color_basic", 1, true],
    [18, "Green", "Verde", "Vert", "Verde", "Verde", "Grün", "Basic Colors 2", "color_basic", 1, true],
    [19, "Gray", "Gris", "Gris", "Cinza", "Grigio", "Grau", "Basic Colors 2", "color_basic", 1, true],
    [20, "Pink", "Rosa", "Rose", "Rosa", "Rosa", "Rosa", "Basic Colors 2", "color_basic", 1, true],

    // --- GRUPO 5: Body Parts 1 (21 - 25) ---
    [21, "Hand", "Mano", "Main", "Mão", "Mano", "Hand", "Body Parts 1", "body_part", 1, true],
    [22, "Face", "Cara", "Visage", "Rosto", "Viso", "Gesicht", "Body Parts 1", "body_part", 1, true],
    [23, "Foot", "Pie", "Pied", "Pé", "Piede", "Fuß", "Body Parts 1", "body_part", 1, true],
    [24, "Eye", "Ojo", "Œil", "Olho", "Occhio", "Auge", "Body Parts 1", "body_part", 1, true],
    [25, "Finger", "Dedo", "Doigt", "Dedo", "Dito", "Finger", "Body Parts 1", "body_part", 1, true],

    // --- GRUPO 6: Body Parts 2 (26 - 30) ---
    [26, "Nose", "Nariz", "Nez", "Nariz", "Naso", "Nase", "Body Parts 2", "body_part", 1, true],
    [27, "Hair", "Cabello", "Cheveux", "Cabelo", "Capelli", "Haar", "Body Parts 2", "body_part", 1, true],
    [28, "Tooth", "Diente", "Dent", "Dente", "Dente", "Zahn", "Body Parts 2", "body_part", 1, true],
    [29, "Leg", "Pierna", "Jambe", "Perna", "Gamba", "Bein", "Body Parts 2", "body_part", 1, true],
    [30, "Head", "Cabeza", "Tête", "Cabeça", "Testa", "Kopf", "Body Parts 2", "body_part", 1, true],

    // --- GRUPO 7: House Structure 1 (31 - 34) ---
    [31, "Door", "Puerta", "Porte", "Porta", "Porta", "Tür", "House Structure 1", "house_part", 2, true],
    [32, "Window", "Ventana", "Fenêtre", "Janela", "Finestra", "Fenster", "House Structure 1", "house_part", 2, true],
    [33, "Wall", "Pared", "Mur", "Parede", "Muro", "Wand", "House Structure 1", "house_part", 2, true],
    [34, "Floor", "Piso", "Sol", "Chão", "Pavimento", "Boden", "House Structure 1", "house_part", 2, true],

    // --- GRUPO 8: House Structure 2 (35 - 39) ---
    [35, "Roof", "Tejado", "Toit", "Telhado", "Tetto", "Dach", "House Structure 2", "house_part", 2, true],
    [36, "Bedroom", "Habitación", "Chambre", "Quarto", "Camera da letto", "Schlafzimmer", "House Structure 2", "house_part", 2, true],
    [37, "Living room", "Sala de estar", "Salon", "Sala de estar", "Soggiorno", "Wohnzimmer", "House Structure 2", "house_part", 2, true],
    [38, "Garden", "Jardín", "Jardin", "Jardim", "Giardino", "Garten", "House Structure 2", "house_part", 2, true],
    [39, "Balcony", "Balcón", "Balcon", "Varanda", "Balcone", "Balkon", "House Structure 2", "house_part", 2, true],

    // --- GRUPO 9: Home Furniture 1 (40 - 43) ---
    [40, "Garage", "Cochera", "Garage", "Garagem", "Garage", "Garage", "Home Furniture 1", "house_part", 2, true],
    [41, "Bed", "Cama", "Lit", "Cama", "Letto", "Bett", "Home Furniture 1", "house_part", 2, true],
    [42, "Table", "Mesa", "Table", "Mesa", "Tavolo", "Tisch", "Home Furniture 1", "house_part", 2, true],
    [43, "Chair", "Silla", "Chaise", "Cadeira", "Sedia", "Stuhl", "Home Furniture 1", "house_part", 2, true],

    // --- GRUPO 10: Home Furniture 2 (44 - 48) ---
    [44, "Sofa", "Sofá", "Canapé", "Sofá", "Divano", "Sofa", "Home Furniture 2", "house_part", 2, true],
    [45, "Desk", "Escritorio", "Bureau", "Escrivaninha", "Scrivania", "Schreibtisch", "Home Furniture 2", "house_part", 2, true],
    [46, "Closet", "Armario", "Armoire", "Armário", "Armadio", "Schrank", "Home Furniture 2", "house_part", 2, true],
    [47, "Shelf", "Estante", "Étagère", "Prateleira", "Scaffale", "Regal", "Home Furniture 2", "house_part", 2, true],
    [48, "Carpet", "Alfombra", "Tapis", "Tapete", "Tappeto", "Teppich", "Home Furniture 2", "house_part", 2, true],

    // --- GRUPO 11: Bedroom Items (49 - 53) ---
    [49, "Pillow", "Almohada", "Oreiller", "Travesseiro", "Cuscino", "Kissen", "Bedroom Items", "house_part", 2, true],
    [50, "Blanket", "Manta", "Couverture", "Cobertor", "Coperta", "Decke", "Bedroom Items", "house_part", 2, true],
    [51, "Mirror", "Espejo", "Miroir", "Espelho", "Specchio", "Spiegel", "Bedroom Items", "house_part", 2, true],
    [52, "Curtain", "Cortina", "Rideau", "Cortina", "Tenda", "Vorhang", "Bedroom Items", "house_part", 2, true],
    [53, "Kitchen", "Cocina", "Cuisine", "Cozinha", "Cucina", "Küche", "Bedroom Items", "house_part", 2, true],

    // --- GRUPO 12: Kitchen Essentials (54 - 58) ---
    [54, "Fridge", "Nevera", "Réfrigérateur", "Geladeira", "Frigorifero", "Kühlschrank", "Kitchen Essentials", "appliance", 2, true],
    [55, "Stove", "Estufa", "Cuisinière", "Fogão", "Fornello", "Herd", "Kitchen Essentials", "appliance", 2, true],
    [56, "Oven", "Horno", "Four", "Forno", "Forno", "Ofen", "Kitchen Essentials", "appliance", 2, true],
    [57, "Sink", "Fregadero", "Évier", "Pia", "Lavandino", "Spülbecken", "Kitchen Essentials", "kitchen_utensil", 2, true],
    [58, "Plate", "Plato", "Assiette", "Prato", "Piatto", "Teller", "Kitchen Essentials", "kitchen_utensil", 2, true],

    // --- GRUPO 13: Kitchenware (59 - 63) ---
    [59, "Glass", "Vaso", "Verre", "Copo", "Bicchiere", "Glas", "Kitchenware", "kitchen_utensil", 2, true],
    [60, "Cup", "Taza", "Tasse", "Xícara", "Tazza", "Tasse", "Kitchenware", "kitchen_utensil", 2, true],
    [61, "Fork", "Tenedor", "Fourchette", "Garfo", "Forchetta", "Gabel", "Kitchenware", "kitchen_utensil", 2, true],
    [62, "Spoon", "Cuchara", "Cuillère", "Colher", "Cucchiaio", "Löffel", "Kitchenware", "kitchen_utensil", 2, true],
    [63, "Knife", "Cuchillo", "Couteau", "Faca", "Coltello", "Messer", "Kitchenware", "kitchen_utensil", 2, true],

    // --- GRUPO 14: Cookware (64 - 68) ---
    [64, "Pan", "Sartén", "Poêle", "Frigideira", "Padella", "Pfanne", "Cookware", "kitchen_utensil", 2, true],
    [65, "Pot", "Olla", "Casserole", "Panela", "Pentola", "Topf", "Cookware", "kitchen_utensil", 2, true],
    [66, "Bottle", "Botella", "Bouteille", "Garrafa", "Bottiglia", "Flasche", "Cookware", "kitchen_utensil", 2, true],
    [67, "Bathroom", "Baño", "Salle de bain", "Banheiro", "Bagno", "Badezimmer", "Cookware", "house_part", 2, true],
    [68, "Towel", "Toalla", "Serviette", "Toalha", "Asciugamano", "Handtuch", "Cookware", "hygiene", 2, true],

    // --- GRUPO 15: Bathroom & Hygiene (69 - 73) ---
    [69, "Soap", "Jabón", "Savon", "Sabonete", "Sapone", "Seife", "Bathroom & Hygiene", "hygiene", 2, true],
    [70, "Shampoo", "Champú", "Shampooing", "Xampu", "Shampoo", "Shampoo", "Bathroom & Hygiene", "hygiene", 2, true],
    [71, "Toothbrush", "Cepillo de dientes", "Brosse à dents", "Escova de dentes", "Spazzolino", "Zahnbürste", "Bathroom & Hygiene", "hygiene", 2, true],
    [72, "Toilet paper", "Papel higiénico", "Papier toilette", "Papel higiênico", "Carta igienica", "Toilettenpapier", "Bathroom & Hygiene", "hygiene", 2, true],
    [73, "Comb", "Peine", "Peigne", "Pente", "Pettine", "Kamm", "Bathroom & Hygiene", "hygiene", 2, true],

    // --- GRUPO 16: Basic Clothing 1 (74 - 78) ---
    [74, "Shirt", "Camisa", "Chemise", "Camisa", "Camicia", "Hemd", "Basic Clothing 1", "clothing_basic", 2, true],
    [75, "T-shirt", "Camiseta", "T-shirt", "Camiseta", "Maglietta", "T-Shirt", "Basic Clothing 1", "clothing_basic", 2, true],
    [76, "Pants", "Pantalones", "Pantalon", "Calças", "Pantaloni", "Hose", "Basic Clothing 1", "clothing_basic", 2, true],
    [77, "Shorts", "Pantalones cortos", "Short", "Shorts", "Pantaloncini", "Shorts", "Basic Clothing 1", "clothing_basic", 2, true],
    [78, "Jeans", "Vaqueros", "Jeans", "Jeans", "Jeans", "Jeans", "Basic Clothing 1", "clothing_basic", 2, true],

    // --- GRUPO 17: Basic Clothing 2 (79 - 83) ---
    [79, "Dress", "Vestido", "Robe", "Vestido", "Abito", "Kleid", "Basic Clothing 2", "clothing_basic", 2, true],
    [80, "Skirt", "Falda", "Jupe", "Saia", "Gonna", "Rock", "Basic Clothing 2", "clothing_basic", 2, true],
    [81, "Jacket", "Chaqueta", "Veste", "Jaqueta", "Giacca", "Jacke", "Basic Clothing 2", "clothing_basic", 2, true],
    [82, "Coat", "Abrigo", "Manteau", "Casaco", "Cappotto", "Mantel", "Basic Clothing 2", "clothing_basic", 2, true],
    [83, "Sweater", "Suéter", "Pull", "Suéter", "Maglioncino", "Pullover", "Basic Clothing 2", "clothing_basic", 2, true],

    // --- GRUPO 18: Footwear (84 - 88) ---
    [84, "Socks", "Calcetines", "Chaussettes", "Meias", "Calze", "Socken", "Footwear", "clothing_basic", 2, true],
    [85, "Shoes", "Zapatos", "Chaussures", "Sapatos", "Scarpe", "Schuhe", "Footwear", "clothing_basic", 2, true],
    [86, "Boots", "Botas", "Bottes", "Botas", "Stivali", "Stiefel", "Footwear", "clothing_basic", 2, true],
    [87, "Sneakers", "Tenis", "Baskets", "Tênis", "Scarpe da ginnastica", "Turnschuhe", "Footwear", "clothing_basic", 2, true],
    [88, "Sandals", "Sandalias", "Sandales", "Sandálias", "Sandali", "Sandalen", "Footwear", "clothing_basic", 2, true],

    // --- GRUPO 19: Personal Belongings 1 (89 - 93) ---
    [89, "Key", "Llave", "Clé", "Chave", "Chiave", "Schlüssel", "Personal Belongings 1", "personal_object", 2, true],
    [90, "Wallet", "Billetera", "Portefeuille", "Carteira", "Portafoglio", "Brieftasche", "Personal Belongings 1", "personal_object", 2, true],
    [91, "Purse", "Bolso", "Sac à main", "Bolsa", "Borsa", "Handtasche", "Personal Belongings 1", "personal_object", 2, true],
    [92, "Umbrella", "Paraguas", "Parapluie", "Guarda-chuva", "Ombrello", "Regenschirm", "Personal Belongings 1", "personal_object", 2, true],
    [93, "Glasses", "Gafas", "Lunettes", "Óculos", "Occhiali", "Brille", "Personal Belongings 1", "personal_object", 2, true],

    // --- GRUPO 20: Personal Belongings 2 (94 - 98) ---
    [94, "Sunglasses", "Gafas de sol", "Lunettes de soleil", "Óculos de sol", "Occhiali da sole", "Sonnenbrille", "Personal Belongings 2", "personal_object", 2, true],
    [95, "Belt", "Cinturón", "Ceinture", "Cinto", "Cintura", "Gürtel", "Personal Belongings 2", "clothing_basic", 2, true],
    [96, "Hat", "Sombrero", "Chapeau", "Chapéu", "Cappello", "Hut", "Personal Belongings 2", "clothing_basic", 2, true],
    [97, "Cap", "Gorra", "Casquette", "Boné", "Cappellino", "Mütze", "Personal Belongings 2", "clothing_basic", 2, true],
    [98, "Watch", "Reloj de pulsera", "Montre", "Relógio", "Orologio", "Armbanduhr", "Personal Belongings 2", "clothing_basic", 2, true],

    // --- GRUPO 21: Accessories & Objects (99 - 103) ---
    [99, "Ring", "Anillo", "Bague", "Anel", "Anello", "Ring", "Accessories & Objects", "personal_object", 2, true],
    [100, "Necklace", "Collar", "Collier", "Colar", "Collana", "Halskette", "Accessories & Objects", "personal_object", 2, true],
    [101, "Money", "Dinero", "Argent", "Dinheiro", "Denaro", "Geld", "Accessories & Objects", "personal_object", 2, true],
    [102, "Bag", "Mochila / Bolsa", "Sac", "Mochila", "Zaino", "Rucksack", "Accessories & Objects", "personal_object", 2, true],
    [103, "Microwave", "Microondas", "Micro-ondes", "Micro-ondas", "Microonde", "Mikrowelle", "Accessories & Objects", "appliance", 2, true],

    // --- GRUPO 22: Home Electronics (104 - 108) ---
    [104, "Lamp", "Lámpara", "Lampe", "Lâmpada", "Lampada", "Lampe", "Home Electronics", "appliance", 2, true],
    [105, "Clock", "Reloj de pared", "Horloge", "Relógio de parede", "Orologio da parete", "Wanduhr", "Home Electronics", "appliance", 2, true],
    [106, "Fan", "Ventilador", "Ventilateur", "Ventilador", "Ventilatore", "Ventilator", "Home Electronics", "appliance", 2, true],
    [107, "TV", "Televisor", "Télévision", "Televisão", "Televisore", "Fernseher", "Home Electronics", "appliance", 2, true],
    [108, "Phone", "Teléfono", "Téléphone", "Telefone", "Telefono", "Telefon", "Home Electronics", "appliance", 2, true],

    // --- GRUPO 23: Maintenance & Tools (109 - 113) ---
    [109, "Charger", "Cargador", "Chargeur", "Carregador", "Caricabatterie", "Ladegerät", "Maintenance & Tools", "appliance", 2, true],
    [110, "Iron", "Plancha", "Fer à repasser", "Ferro de passar", "Ferro da stiro", "Bügeleisen", "Maintenance & Tools", "appliance", 2, true],
    [111, "Washer", "Lavadora", "Lave-linge", "Máquina de lavar", "Lavatrice", "Waschmaschine", "Maintenance & Tools", "appliance", 2, true],
    [112, "Broom", "Escoba", "Balai", "Vassoura", "Scopa", "Besen", "Maintenance & Tools", "house_part", 2, true],
    [113, "Trash can", "Cubo de basura", "Poubelle", "Lixeira", "Cestino", "Mülleimer", "Maintenance & Tools", "house_part", 2, true],

    // --- GRUPO 24: Daily Items & Cleaning (114 - 118) ---
    [114, "Needle", "Aguja", "Aiguille", "Aguha", "Ago", "Nadel", "Daily Items & Cleaning", "house_part", 2, true],
    [115, "Thread", "Hilo", "Fil", "Fio", "Filo", "Faden", "Daily Items & Cleaning", "house_part", 2, true],
    [116, "Bucket", "Balde", "Seau", "Balde", "Secchio", "Eimer", "Daily Items & Cleaning", "house_part", 2, true],
    [117, "Tray", "Bandeja", "Plateau", "Bandeja", "Vassoio", "Tablett", "Daily Items & Cleaning", "kitchen_utensil", 2, true],
    [118, "Pitcher", "Jarra", "Pichet", "Jarra", "Brocca", "Krug", "Daily Items & Cleaning", "kitchen_utensil", 2, true],

    // --- GRUPO 25: Fruits (119 - 123) ---
    [119, "Apple", "Manzana", "Pomme", "Maçã", "Mela", "Apfel", "Fruits", "fruit", 4, true],
    [120, "Banana", "Plátano", "Banane", "Banana", "Banana", "Banane", "Fruits", "fruit", 4, true],
    [121, "Orange", "Naranja", "Orange", "Laranja", "Arancia", "Orange", "Fruits", "fruit", 4, true],
    [122, "Lemon", "Limón", "Citron", "Limão", "Limone", "Zitrone", "Fruits", "fruit", 4, true],
    [123, "Grape", "Uva", "Raisin", "Uva", "Uva", "Traube", "Fruits", "fruit", 4, true],

    // --- GRUPO 26: Vegetables (124 - 128) ---
    [124, "Potato", "Patata", "Pomme de terre", "Batata", "Patata", "Kartoffel", "Vegetables", "fruit", 4, true],
    [125, "Tomato", "Tomate", "Tomate", "Tomate", "Pomodoro", "Tomate", "Vegetables", "fruit", 4, true],
    [126, "Onion", "Cebolla", "Oignon", "Cebola", "Cipolla", "Zwiebel", "Vegetables", "fruit", 4, true],
    [127, "Carrot", "Zanahoria", "Carotte", "Cenoura", "Carota", "Karotte", "Vegetables", "fruit", 4, true],
    [128, "Garlic", "Ajo", "Ail", "Alho", "Aglio", "Knoblauch", "Vegetables", "fruit", 4, true],

    // --- GRUPO 27: Meats & Proteins (129 - 132) ---
    [129, "Meat", "Carne", "Viande", "Carne", "Carne", "Fleisch", "Meats & Proteins", "food", 4, true],
    [130, "Chicken", "Pollo", "Poulet", "Frango", "Pollo", "Hähnchen", "Meats & Proteins", "food", 4, true],
    [131, "Beef", "Carne de res", "Bœuf", "Carne bovina", "Manzo", "Rindfleisch", "Meats & Proteins", "food", 4, true],
    [132, "Fish", "Pescado", "Poisson", "Peixe", "Pesce", "Fisch", "Meats & Proteins", "food", 4, true],

    // --- GRUPO 28: Staple Foods (133 - 137) ---
    [133, "Bread", "Pan", "Pain", "Pão", "Pane", "Brot", "Staple Foods", "food", 4, true],
    [134, "Rice", "Arroz", "Riz", "Arroz", "Riso", "Reis", "Staple Foods", "food", 4, true],
    [135, "Cheese", "Queso", "Fromage", "Queijo", "Formaggio", "Käse", "Staple Foods", "food", 4, true],
    [136, "Egg", "Huevo", "Œuf", "Ovo", "Uovo", "Ei", "Staple Foods", "food", 4, true],
    [137, "Soup", "Sopa", "Soupe", "Sopa", "Zuppa", "Suppe", "Staple Foods", "food", 4, true],

    // --- GRUPO 29: Beverages (138 - 142) ---
    [138, "Water", "Agua", "Eau", "Água", "Acqua", "Wasser", "Beverages", "drink", 4, true],
    [139, "Coffee", "Café", "Café", "Café", "Caffè", "Kaffee", "Beverages", "drink", 4, true],
    [140, "Tea", "Té", "Thé", "Chá", "Tè", "Tee", "Beverages", "drink", 4, true],
    [141, "Milk", "Leche", "Lait", "Leite", "Latte", "Milch", "Beverages", "drink", 4, true],
    [142, "Juice", "Jugo / Zumo", "Jus", "Suco", "Succo", "Saft", "Beverages", "drink", 4, true]
];

// ==========================================================================
// 4. MAPEADOR INTELIGENTE CON SELECCIÓN DINÁMICA DE IDIOMA
// ==========================================================================
export const VOCABULARY_DATABASE = RAW_VOCABULARIO.map(([id, en, es, fr, pt, it, de, topic, categoryKey, unit, hasImage]) => {
    const category = VOCAB_TAXONOMY.category[categoryKey] || categoryKey;

    let mediaUrl = null;
    if (hasImage) {
        const cleanFileName = en.toLowerCase().replace(/'/g, '').trim().replace(/\s+/g, '-');
        mediaUrl = `${SUPABASE_BASE_URL}/${category}/${cleanFileName}.svg`;
    }

    let syntax = VOCAB_TAXONOMY.syntax.noun;
    if (["color_basic", "dimension", "evaluation", "physical_state"].includes(categoryKey)) syntax = VOCAB_TAXONOMY.syntax.adjective;

    let pattern_id = "P_DONT_UNDERSTAND";
    if (["color_basic"].includes(categoryKey)) pattern_id = "P_WHAT_IS_YOUR";
    else if (["city_place", "house_part"].includes(categoryKey)) pattern_id = "P_WHERE_IS";
    else if (["dimension", "evaluation", "physical_state"].includes(categoryKey)) pattern_id = "P_REPORT_STATE";
    else if (categoryKey === "body_part") pattern_id = "P_I_NEED";

    const translations = { en, es, fr, pt, it, de };
    const targetLang = window.AppState?.targetLanguage || localStorage.getItem('lukes_target_lang') || 'es';
    const activeTranslation = translations[targetLang] || es;

    return {
        id,
        word: en,
        spanish: activeTranslation,
        translations,
        topic,
        category,
        unit,
        euroLevel: unit <= 5 ? "A1" : unit <= 10 ? "A2" : "B1",
        syntax,
        article: syntax === "noun" ? (['a', 'e', 'i', 'o', 'u'].includes(en.trim().toLowerCase()[0]) ? 'an' : 'a') : null,
        pattern_id,
        hasImage,
        media_url: mediaUrl
    };
});
