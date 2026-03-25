// Grade 12 Agriculture Questions Data
export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const grade12AgricultureQuestions: { [key: string]: Question[] } = {
  "Unit 1: Crop Production": [
    {
      id: "agr12_crop_e1",
      question: "What is the primary purpose of tillage in crop production?",
      options: ["To add nutrients to soil", "To prepare soil for planting and improve structure", "To harvest crops", "To apply pesticides"],
      correct: "To prepare soil for planting and improve structure",
      explanation: "Tillage involves breaking up, loosening, and turning the soil to prepare it for planting and improve soil structure for better root development.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_e2",
      question: "Which of the following is considered a cash crop in Ethiopia?",
      options: ["Teff", "Coffee", "Barley", "Wheat"],
      correct: "Coffee",
      explanation: "Coffee is Ethiopia's primary cash crop and major export commodity, generating significant foreign exchange revenue.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_e3",
      question: "What is the most important factor for seed germination?",
      options: ["Sunlight", "Moisture", "Fertilizer", "Wind"],
      correct: "Moisture",
      explanation: "Moisture is essential for seed germination as it activates enzymes and allows the seed to swell and break its coat.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_e4",
      question: "Which nutrient is known as the 'building block of life' for plants?",
      options: ["Phosphorus", "Potassium", "Nitrogen", "Calcium"],
      correct: "Nitrogen",
      explanation: "Nitrogen is crucial for protein synthesis and chlorophyll formation, making it essential for plant growth and development.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_e5",
      question: "What is photosynthesis in plants?",
      options: ["Breaking down of food", "Converting sunlight to chemical energy", "Root absorption", "Seed dispersal"],
      correct: "Converting sunlight to chemical energy",
      explanation: "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_e6",
      question: "Which part of the plant is primarily responsible for water absorption?",
      options: ["Leaves", "Stem", "Roots", "Flowers"],
      correct: "Roots",
      explanation: "Roots absorb water and nutrients from the soil through their root hairs, which increase the surface area for absorption.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_e7",
      question: "What is the main function of fertilizers in crop production?",
      options: ["To kill pests", "To provide nutrients", "To control weeds", "To improve taste"],
      correct: "To provide nutrients",
      explanation: "Fertilizers supply essential nutrients like nitrogen, phosphorus, and potassium that plants need for healthy growth.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_e8",
      question: "Which season is typically best for planting most crops in Ethiopia?",
      options: ["Dry season", "Rainy season", "Winter", "Hot season"],
      correct: "Rainy season",
      explanation: "The rainy season provides adequate moisture for seed germination and early plant growth.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_e9",
      question: "What is a weed in agriculture?",
      options: ["A useful plant", "An unwanted plant competing with crops", "A type of fertilizer", "A farming tool"],
      correct: "An unwanted plant competing with crops",
      explanation: "Weeds are unwanted plants that compete with crops for nutrients, water, sunlight, and space.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_e10",
      question: "Which of the following is a cereal crop?",
      options: ["Coffee", "Cotton", "Maize", "Sugarcane"],
      correct: "Maize",
      explanation: "Maize (corn) is a cereal crop that produces grains used for food and feed.",
      difficulty: "Easy"
    },
    {
      id: "agr12_crop_m1",
      question: "What is crop rotation and why is it important?",
      options: ["Growing the same crop yearly for consistency", "Growing different crops in sequence to maintain soil fertility", "Rotating fields annually", "Changing farming locations"],
      correct: "Growing different crops in sequence to maintain soil fertility",
      explanation: "Crop rotation involves growing different crops in planned sequence on the same field to maintain soil fertility, break pest cycles, and improve yields.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_m2",
      question: "Which irrigation method is most water-efficient for crop production?",
      options: ["Flood irrigation", "Furrow irrigation", "Drip irrigation", "Sprinkler irrigation"],
      correct: "Drip irrigation",
      explanation: "Drip irrigation delivers water directly to plant roots, minimizing water loss through evaporation and ensuring efficient water use.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_m3",
      question: "What is integrated pest management (IPM)?",
      options: ["Using only chemical pesticides", "Combining biological, cultural, and chemical pest control methods", "Eliminating all insects", "Using only organic methods"],
      correct: "Combining biological, cultural, and chemical pest control methods",
      explanation: "IPM combines multiple pest control strategies to minimize pesticide use while effectively managing pests.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_m4",
      question: "Which soil pH range is optimal for most crops?",
      options: ["4.0-5.0", "6.0-7.0", "8.0-9.0", "9.0-10.0"],
      correct: "6.0-7.0",
      explanation: "Most crops grow best in slightly acidic to neutral soil (pH 6.0-7.0) where nutrients are most available.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_m5",
      question: "What is the purpose of mulching in crop production?",
      options: ["To add color to fields", "To conserve moisture and suppress weeds", "To attract insects", "To increase soil temperature"],
      correct: "To conserve moisture and suppress weeds",
      explanation: "Mulching covers soil surface to retain moisture, suppress weeds, and regulate soil temperature.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_m6",
      question: "Which factor most influences the timing of harvest?",
      options: ["Weather forecast", "Crop maturity", "Market prices", "Labor availability"],
      correct: "Crop maturity",
      explanation: "Crop maturity is the primary factor determining harvest timing to ensure optimal quality and yield.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_m7",
      question: "What is intercropping?",
      options: ["Growing crops in greenhouses", "Growing two or more crops simultaneously on the same field", "Growing crops in rows", "Growing crops in pots"],
      correct: "Growing two or more crops simultaneously on the same field",
      explanation: "Intercropping involves growing multiple crops together to maximize land use and improve productivity.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_m8",
      question: "Which of the following best describes sustainable agriculture?",
      options: ["Maximum production at any cost", "Farming that maintains productivity while protecting the environment", "Using only modern technology", "Focusing solely on profit"],
      correct: "Farming that maintains productivity while protecting the environment",
      explanation: "Sustainable agriculture balances productivity, environmental protection, and economic viability for long-term success.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_m9",
      question: "What is the main benefit of cover crops?",
      options: ["Immediate income generation", "Soil protection and improvement", "Pest attraction", "Decoration"],
      correct: "Soil protection and improvement",
      explanation: "Cover crops protect soil from erosion, improve soil structure, and add organic matter when decomposed.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_m10",
      question: "Which technique helps prevent soil erosion on sloped land?",
      options: ["Deep plowing", "Contour farming", "Monocropping", "Heavy irrigation"],
      correct: "Contour farming",
      explanation: "Contour farming involves plowing and planting across slopes to reduce water runoff and soil erosion.",
      difficulty: "Medium"
    },
    {
      id: "agr12_crop_h1",
      question: "Analyze the impact of climate change on traditional crop production systems in Ethiopia.",
      options: ["No significant impact on traditional systems", "Requires adaptation strategies including drought-resistant varieties", "Only affects modern farming", "Eliminates need for traditional knowledge"],
      correct: "Requires adaptation strategies including drought-resistant varieties",
      explanation: "Climate change significantly impacts traditional farming through altered rainfall patterns, requiring adaptive strategies like drought-resistant crops and improved water management.",
      difficulty: "Hard"
    },
    {
      id: "agr12_crop_h2",
      question: "Evaluate the role of precision agriculture in optimizing crop yields.",
      options: ["Only useful for large-scale farming", "Uses technology to optimize inputs and maximize efficiency", "Replaces farmer knowledge completely", "Only focuses on increasing production"],
      correct: "Uses technology to optimize inputs and maximize efficiency",
      explanation: "Precision agriculture uses GPS, sensors, and data analysis to optimize input application, reduce waste, and maximize crop efficiency.",
      difficulty: "Hard"
    },
    {
      id: "agr12_crop_h3",
      question: "What is the most critical factor in developing climate-resilient cropping systems?",
      options: ["Using only hybrid seeds", "Genetic diversity and adaptive management", "Maximum irrigation", "Chemical fertilizers"],
      correct: "Genetic diversity and adaptive management",
      explanation: "Genetic diversity provides resilience against climate variations, while adaptive management allows farmers to respond to changing conditions.",
      difficulty: "Hard"
    },
    {
      id: "agr12_crop_h4",
      question: "Analyze the long-term effects of continuous monoculture on soil health.",
      options: ["Improves soil fertility", "Leads to soil degradation and increased pest pressure", "Has no significant impact", "Only affects crop yields"],
      correct: "Leads to soil degradation and increased pest pressure",
      explanation: "Continuous monoculture depletes specific nutrients, reduces soil biodiversity, and increases pest and disease pressure over time.",
      difficulty: "Hard"
    },
    {
      id: "agr12_crop_h5",
      question: "Design an integrated approach to manage nutrient cycles in sustainable cropping systems.",
      options: ["Use only synthetic fertilizers", "Combine organic amendments, crop rotation, and precision application", "Rely solely on natural processes", "Focus only on nitrogen management"],
      correct: "Combine organic amendments, crop rotation, and precision application",
      explanation: "Effective nutrient management integrates organic matter, diverse cropping patterns, and precise fertilizer application based on soil testing.",
      difficulty: "Hard"
    },
    {
      id: "agr12_crop_h6",
      question: "What is the primary challenge in implementing conservation agriculture?",
      options: ["High initial costs and knowledge requirements", "Lack of machinery", "Government regulations", "Climate limitations"],
      correct: "High initial costs and knowledge requirements",
      explanation: "Conservation agriculture requires significant investment in equipment and farmer training, making adoption challenging for smallholder farmers.",
      difficulty: "Hard"
    },
    {
      id: "agr12_crop_h7",
      question: "Evaluate the potential of biotechnology in addressing food security challenges.",
      options: ["Limited applications in agriculture", "Can enhance crop resilience and nutritional content", "Only useful for developed countries", "Replaces traditional breeding completely"],
      correct: "Can enhance crop resilience and nutritional content",
      explanation: "Biotechnology offers tools to develop crops with improved stress tolerance, disease resistance, and enhanced nutritional profiles.",
      difficulty: "Hard"
    },
    {
      id: "agr12_crop_h8",
      question: "What is the most effective strategy for managing herbicide resistance in weeds?",
      options: ["Use stronger herbicides", "Rotate herbicide modes of action and integrate cultural practices", "Increase application rates", "Switch to organic farming"],
      correct: "Rotate herbicide modes of action and integrate cultural practices",
      explanation: "Managing herbicide resistance requires rotating different herbicide types and combining with cultural control methods to prevent resistance development.",
      difficulty: "Hard"
    },
    {
      id: "agr12_crop_h9",
      question: "Analyze the role of soil microbiome in crop health and productivity.",
      options: ["Minimal impact on crops", "Critical for nutrient cycling and plant health", "Only affects organic farming", "Harmful to crop production"],
      correct: "Critical for nutrient cycling and plant health",
      explanation: "Soil microorganisms play essential roles in nutrient cycling, disease suppression, and plant growth promotion through symbiotic relationships.",
      difficulty: "Hard"
    },
    {
      id: "agr12_crop_h10",
      question: "Design a comprehensive strategy for carbon sequestration in agricultural systems.",
      options: ["Focus only on tree planting", "Integrate cover crops, reduced tillage, and diverse rotations", "Use only chemical methods", "Eliminate all farming activities"],
      correct: "Integrate cover crops, reduced tillage, and diverse rotations",
      explanation: "Effective carbon sequestration requires multiple practices including cover crops, minimal tillage, diverse rotations, and organic amendments.",
      difficulty: "Hard"
    }
  ],
  "Unit 2: Livestock Management": [
    {
      id: "agr12_livestock_e1",
      question: "What is the primary function of vitamins in livestock nutrition?",
      options: ["Provide energy", "Build muscle tissue", "Regulate body functions and metabolism", "Provide structural support"],
      correct: "Regulate body functions and metabolism",
      explanation: "Vitamins are essential micronutrients that regulate various body functions, support metabolism, and maintain overall health in livestock.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_e2",
      question: "Which of the following is a common sign of good health in cattle?",
      options: ["Droopy ears", "Bright, alert eyes", "Rough coat", "Labored breathing"],
      correct: "Bright, alert eyes",
      explanation: "Bright, alert eyes indicate good health in cattle, while droopy ears, rough coats, and labored breathing may indicate health problems.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_e3",
      question: "What is the main purpose of vaccination in livestock?",
      options: ["To increase growth rate", "To prevent diseases", "To improve meat quality", "To reduce feed consumption"],
      correct: "To prevent diseases",
      explanation: "Vaccination stimulates the immune system to protect animals against specific diseases before exposure occurs.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_e4",
      question: "Which animal is considered ruminant?",
      options: ["Pig", "Chicken", "Cow", "Horse"],
      correct: "Cow",
      explanation: "Cows are ruminants with a four-chambered stomach that allows them to digest cellulose through microbial fermentation.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_e5",
      question: "What is the normal body temperature range for healthy cattle?",
      options: ["36-37°C", "38-39°C", "40-41°C", "42-43°C"],
      correct: "38-39°C",
      explanation: "Normal body temperature for cattle ranges from 38-39°C (100.4-102.2°F), with slight variations based on environmental conditions.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_e6",
      question: "Which nutrient provides the most energy in livestock feed?",
      options: ["Protein", "Carbohydrates", "Vitamins", "Minerals"],
      correct: "Carbohydrates",
      explanation: "Carbohydrates, including grains and forages, provide the primary energy source for livestock metabolism and production.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_e7",
      question: "What is colostrum?",
      options: ["A type of feed", "First milk after birth", "A disease", "A breeding technique"],
      correct: "First milk after birth",
      explanation: "Colostrum is the first milk produced after giving birth, rich in antibodies that provide passive immunity to newborns.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_e8",
      question: "Which housing system allows animals to move freely?",
      options: ["Battery cages", "Free-range system", "Tie-stall system", "Individual pens"],
      correct: "Free-range system",
      explanation: "Free-range systems allow animals to move freely and express natural behaviors, improving animal welfare.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_e9",
      question: "What is castration in livestock management?",
      options: ["Surgical removal of reproductive organs", "Feeding practice", "Housing method", "Breeding technique"],
      correct: "Surgical removal of reproductive organs",
      explanation: "Castration involves surgical removal of male reproductive organs to control reproduction and improve meat quality.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_e10",
      question: "Which factor is most important for livestock water quality?",
      options: ["Temperature", "Color", "Cleanliness and safety", "Taste"],
      correct: "Cleanliness and safety",
      explanation: "Clean, safe water free from contaminants is essential for animal health and optimal production performance.",
      difficulty: "Easy"
    },
    {
      id: "agr12_livestock_m1",
      question: "What is the purpose of quarantine in livestock management?",
      options: ["To increase feed efficiency", "To prevent disease spread", "To improve breeding", "To reduce labor costs"],
      correct: "To prevent disease spread",
      explanation: "Quarantine isolates new or sick animals to prevent the spread of diseases to the healthy herd, protecting overall animal health.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_m2",
      question: "Which breeding system aims to combine the best traits of different breeds?",
      options: ["Inbreeding", "Line breeding", "Crossbreeding", "Outcrossing"],
      correct: "Crossbreeding",
      explanation: "Crossbreeding combines different breeds to capture hybrid vigor and combine desirable traits from both parent breeds.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_m3",
      question: "What is the recommended protein content in dairy cow rations?",
      options: ["8-10%", "12-18%", "25-30%", "35-40%"],
      correct: "12-18%",
      explanation: "Dairy cows typically require 12-18% crude protein in their diet, depending on production stage and milk yield.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_m4",
      question: "Which reproductive technology allows storage of genetic material?",
      options: ["Natural mating", "Embryo transfer", "Semen cryopreservation", "Hormone synchronization"],
      correct: "Semen cryopreservation",
      explanation: "Semen cryopreservation allows long-term storage of genetic material from superior bulls for future breeding.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_m5",
      question: "What is the primary cause of mastitis in dairy cows?",
      options: ["Poor nutrition", "Bacterial infection", "Genetic factors", "Environmental stress"],
      correct: "Bacterial infection",
      explanation: "Mastitis is primarily caused by bacterial infections in the mammary gland, often due to poor hygiene and management.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_m6",
      question: "Which factor most influences feed conversion efficiency?",
      options: ["Animal age", "Genetic potential and nutrition quality", "Housing type", "Weather conditions"],
      correct: "Genetic potential and nutrition quality",
      explanation: "Feed conversion efficiency depends on animal genetics and the nutritional quality and balance of the diet provided.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_m7",
      question: "What is the gestation period for cattle?",
      options: ["6 months", "9 months", "12 months", "15 months"],
      correct: "9 months",
      explanation: "The gestation period for cattle is approximately 9 months (280-285 days) from conception to calving.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_m8",
      question: "Which management practice improves pasture utilization?",
      options: ["Continuous grazing", "Rotational grazing", "Overgrazing", "Zero grazing only"],
      correct: "Rotational grazing",
      explanation: "Rotational grazing allows pastures to recover while maximizing forage utilization and maintaining pasture health.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_m9",
      question: "What is body condition scoring used for?",
      options: ["Determining market price", "Assessing nutritional status", "Measuring growth rate", "Evaluating breeding soundness"],
      correct: "Assessing nutritional status",
      explanation: "Body condition scoring evaluates fat reserves and nutritional status to guide feeding and management decisions.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_m10",
      question: "Which biosecurity measure is most effective in preventing disease outbreaks?",
      options: ["Regular vaccination only", "Controlling animal movement and visitor access", "Using antibiotics preventively", "Isolating sick animals only"],
      correct: "Controlling animal movement and visitor access",
      explanation: "Controlling access and movement prevents disease introduction and spread, forming the foundation of effective biosecurity.",
      difficulty: "Medium"
    },
    {
      id: "agr12_livestock_h1",
      question: "Evaluate the role of artificial insemination in improving livestock genetics in developing countries.",
      options: ["Limited impact due to infrastructure", "Revolutionizes genetic improvement through access to superior genetics", "Only useful for large commercial farms", "Replaces natural breeding completely"],
      correct: "Revolutionizes genetic improvement through access to superior genetics",
      explanation: "Artificial insemination provides access to superior genetics from proven sires, dramatically improving livestock productivity even in resource-limited settings.",
      difficulty: "Hard"
    },
    {
      id: "agr12_livestock_h2",
      question: "Analyze the impact of heat stress on dairy cow productivity and mitigation strategies.",
      options: ["No significant impact on production", "Reduces milk yield and requires comprehensive cooling strategies", "Only affects reproduction", "Can be ignored in management"],
      correct: "Reduces milk yield and requires comprehensive cooling strategies",
      explanation: "Heat stress significantly reduces milk production, feed intake, and reproduction, requiring shade, ventilation, and cooling systems for mitigation.",
      difficulty: "Hard"
    },
    {
      id: "agr12_livestock_h3",
      question: "Design an integrated approach to control internal parasites in grazing livestock.",
      options: ["Use anthelmintics exclusively", "Combine strategic deworming, pasture management, and selective breeding", "Rely only on natural immunity", "Ignore parasite control"],
      correct: "Combine strategic deworming, pasture management, and selective breeding",
      explanation: "Effective parasite control integrates strategic treatments, rotational grazing, genetic selection, and monitoring for sustainable management.",
      difficulty: "Hard"
    },
    {
      id: "agr12_livestock_h4",
      question: "Evaluate the potential of genomic selection in livestock breeding programs.",
      options: ["Has no practical application", "Accelerates genetic progress through DNA-based selection", "Only useful for research", "Replaces performance testing completely"],
      correct: "Accelerates genetic progress through DNA-based selection",
      explanation: "Genomic selection uses DNA markers to predict genetic merit, accelerating breeding progress and improving accuracy of selection decisions.",
      difficulty: "Hard"
    },
    {
      id: "agr12_livestock_h5",
      question: "What is the most critical factor in developing climate-resilient livestock systems?",
      options: ["Using only exotic breeds", "Genetic diversity and adaptive management practices", "Maximum housing investment", "Avoiding traditional breeds"],
      correct: "Genetic diversity and adaptive management practices",
      explanation: "Climate resilience requires diverse genetics adapted to local conditions and flexible management practices that respond to environmental changes.",
      difficulty: "Hard"
    },
    {
      id: "agr12_livestock_h6",
      question: "Analyze the role of rumen microbiome in ruminant nutrition and health.",
      options: ["Minimal importance for digestion", "Critical for fiber digestion and immune function", "Only affects feed intake", "Can be completely replaced by supplements"],
      correct: "Critical for fiber digestion and immune function",
      explanation: "Rumen microbiome is essential for cellulose digestion, vitamin synthesis, and maintaining ruminant health through complex microbial interactions.",
      difficulty: "Hard"
    },
    {
      id: "agr12_livestock_h7",
      question: "Design a comprehensive breeding program for dual-purpose cattle in smallholder systems.",
      options: ["Focus only on milk production", "Balance milk and meat traits with local adaptation", "Use only exotic genetics", "Ignore economic factors"],
      correct: "Balance milk and meat traits with local adaptation",
      explanation: "Dual-purpose breeding programs must balance production traits with adaptation to local conditions and economic constraints of smallholder farmers.",
      difficulty: "Hard"
    },
    {
      id: "agr12_livestock_h8",
      question: "Evaluate the sustainability implications of intensive livestock production systems.",
      options: ["Always environmentally sustainable", "Require careful management of environmental impacts", "Have no environmental concerns", "Should be completely avoided"],
      correct: "Require careful management of environmental impacts",
      explanation: "Intensive systems can be efficient but require careful management of waste, emissions, and resource use to minimize environmental impacts.",
      difficulty: "Hard"
    },
    {
      id: "agr12_livestock_h9",
      question: "What is the most effective approach to reduce methane emissions from ruminants?",
      options: ["Eliminate ruminant production", "Optimize nutrition and use feed additives", "Reduce animal numbers only", "Ignore emission concerns"],
      correct: "Optimize nutrition and use feed additives",
      explanation: "Methane reduction requires optimized nutrition, quality feeds, and specific additives that modify rumen fermentation patterns.",
      difficulty: "Hard"
    },
    {
      id: "agr12_livestock_h10",
      question: "Design an integrated health management system for organic livestock production.",
      options: ["Use conventional medicines freely", "Emphasize prevention through nutrition and management", "Avoid all veterinary interventions", "Focus only on treatment"],
      correct: "Emphasize prevention through nutrition and management",
      explanation: "Organic livestock health management prioritizes disease prevention through proper nutrition, housing, and management while limiting therapeutic interventions.",
      difficulty: "Hard"
    }
  ],
  "Unit 3: Soil Science and Fertility": [
    {
      id: "agr12_soil_e1",
      question: "What are the three main components of soil texture?",
      options: ["Nitrogen, phosphorus, potassium", "Sand, silt, clay", "Organic matter, minerals, water", "Bacteria, fungi, insects"],
      correct: "Sand, silt, clay",
      explanation: "Soil texture is determined by the relative proportions of sand (largest particles), silt (medium particles), and clay (smallest particles).",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_e2",
      question: "Which soil pH range is generally considered optimal for most crops?",
      options: ["4.0-5.0", "6.0-7.0", "8.0-9.0", "3.0-4.0"],
      correct: "6.0-7.0",
      explanation: "Most crops grow best in slightly acidic to neutral soil with pH 6.0-7.0, where nutrients are most readily available.",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_e3",
      question: "What is soil organic matter?",
      options: ["Only dead plant material", "Living and dead plant and animal materials in soil", "Chemical fertilizers", "Rock particles"],
      correct: "Living and dead plant and animal materials in soil",
      explanation: "Soil organic matter includes all living organisms and decomposing plant and animal materials that improve soil properties.",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_e4",
      question: "Which nutrient is most commonly deficient in soils?",
      options: ["Nitrogen", "Oxygen", "Carbon", "Hydrogen"],
      correct: "Nitrogen",
      explanation: "Nitrogen is often the most limiting nutrient in agricultural soils due to its high mobility and plant demand.",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_e5",
      question: "What causes soil erosion?",
      options: ["Wind and water", "Fertilizer application", "Deep plowing", "Irrigation"],
      correct: "Wind and water",
      explanation: "Soil erosion is primarily caused by wind and water moving soil particles from their original location.",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_e6",
      question: "Which soil horizon is most important for plant growth?",
      options: ["A horizon (topsoil)", "B horizon (subsoil)", "C horizon (parent material)", "R horizon (bedrock)"],
      correct: "A horizon (topsoil)",
      explanation: "The A horizon contains the most organic matter and nutrients, making it crucial for plant root development and growth.",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_e7",
      question: "What is soil compaction?",
      options: ["Soil becoming loose", "Soil particles being pressed together", "Soil erosion", "Soil contamination"],
      correct: "Soil particles being pressed together",
      explanation: "Soil compaction occurs when soil particles are pressed together, reducing pore space and limiting root growth and water infiltration.",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_e8",
      question: "Which element is essential for chlorophyll formation?",
      options: ["Iron", "Magnesium", "Calcium", "Sulfur"],
      correct: "Magnesium",
      explanation: "Magnesium is the central atom in chlorophyll molecules, essential for photosynthesis and green plant coloration.",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_e9",
      question: "What is the main function of phosphorus in plants?",
      options: ["Energy transfer", "Water absorption", "Pest resistance", "Flavor enhancement"],
      correct: "Energy transfer",
      explanation: "Phosphorus is crucial for energy transfer processes in plants, particularly in the formation of ATP and root development.",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_e10",
      question: "Which practice helps increase soil organic matter?",
      options: ["Excessive tillage", "Adding compost", "Removing crop residues", "Using only chemical fertilizers"],
      correct: "Adding compost",
      explanation: "Adding compost and other organic amendments increases soil organic matter, improving soil structure and fertility.",
      difficulty: "Easy"
    },
    {
      id: "agr12_soil_m1",
      question: "What is soil organic matter and why is it important?",
      options: ["Only dead plant material", "Living and dead organisms that improve soil structure and fertility", "Inorganic minerals", "Chemical fertilizers"],
      correct: "Living and dead organisms that improve soil structure and fertility",
      explanation: "Soil organic matter includes living organisms, decomposing plant and animal materials that enhance soil structure, water retention, and nutrient availability.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_m2",
      question: "How does soil erosion impact agricultural productivity?",
      options: ["Increases soil fertility", "Removes topsoil and reduces productivity", "Has no effect on crops", "Only affects appearance"],
      correct: "Removes topsoil and reduces productivity",
      explanation: "Soil erosion removes the nutrient-rich topsoil layer, reducing soil fertility and agricultural productivity while degrading the growing environment.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_m3",
      question: "What is cation exchange capacity (CEC) and why is it important?",
      options: ["Soil water holding capacity", "Ability to hold and exchange positively charged nutrients", "Soil pH measurement", "Soil texture classification"],
      correct: "Ability to hold and exchange positively charged nutrients",
      explanation: "CEC measures the soil's ability to hold and exchange cations like calcium, magnesium, and potassium, indicating nutrient retention capacity.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_m4",
      question: "Which soil management practice improves soil structure?",
      options: ["Excessive tillage", "No-till farming with cover crops", "Continuous cropping", "Heavy machinery use"],
      correct: "No-till farming with cover crops",
      explanation: "No-till farming preserves soil structure while cover crops add organic matter and protect soil surface from erosion.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_m5",
      question: "What is the relationship between soil pH and nutrient availability?",
      options: ["No relationship exists", "pH affects nutrient solubility and plant uptake", "Only affects nitrogen", "pH only matters for organic matter"],
      correct: "pH affects nutrient solubility and plant uptake",
      explanation: "Soil pH significantly influences nutrient availability, with most nutrients being most available in slightly acidic to neutral conditions.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_m6",
      question: "Which factor most influences soil water holding capacity?",
      options: ["Soil color", "Soil texture and organic matter content", "Soil temperature", "Soil age"],
      correct: "Soil texture and organic matter content",
      explanation: "Clay content and organic matter significantly influence soil's ability to hold water, with finer textures holding more water.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_m7",
      question: "What is nutrient cycling in soil ecosystems?",
      options: ["Adding fertilizers repeatedly", "Natural process of nutrient transformation and availability", "Removing nutrients from soil", "Chemical reactions only"],
      correct: "Natural process of nutrient transformation and availability",
      explanation: "Nutrient cycling involves the continuous transformation of nutrients through biological, chemical, and physical processes in soil.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_m8",
      question: "Which soil test is most important for fertilizer recommendations?",
      options: ["Soil color test", "Comprehensive soil analysis including pH and nutrients", "Moisture content only", "Texture analysis only"],
      correct: "Comprehensive soil analysis including pH and nutrients",
      explanation: "A complete soil test analyzing pH, organic matter, and available nutrients provides the basis for effective fertilizer recommendations.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_m9",
      question: "What is the role of soil microorganisms in fertility?",
      options: ["They have no impact", "They decompose organic matter and cycle nutrients", "They only cause diseases", "They compete with plants"],
      correct: "They decompose organic matter and cycle nutrients",
      explanation: "Soil microorganisms decompose organic matter, cycle nutrients, and form beneficial relationships with plant roots.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_m10",
      question: "Which conservation practice is most effective on steep slopes?",
      options: ["Deep plowing", "Terracing and contour farming", "Removing vegetation", "Intensive cultivation"],
      correct: "Terracing and contour farming",
      explanation: "Terracing and contour farming reduce water runoff velocity and soil erosion on sloped lands while maintaining productivity.",
      difficulty: "Medium"
    },
    {
      id: "agr12_soil_h1",
      question: "Design a comprehensive soil conservation strategy for sloped agricultural land in the Ethiopian highlands.",
      options: ["Use only chemical fertilizers", "Implement terracing, cover crops, and agroforestry systems", "Clear all vegetation", "Apply maximum tillage"],
      correct: "Implement terracing, cover crops, and agroforestry systems",
      explanation: "Effective soil conservation on slopes requires integrated approaches including terracing to reduce runoff, cover crops to protect soil, and agroforestry for long-term sustainability.",
      difficulty: "Hard"
    },
    {
      id: "agr12_soil_h2",
      question: "Analyze the long-term impacts of soil acidification on crop production systems.",
      options: ["No significant effects", "Reduces nutrient availability and crop yields requiring lime application", "Only affects soil color", "Improves all crop production"],
      correct: "Reduces nutrient availability and crop yields requiring lime application",
      explanation: "Soil acidification reduces nutrient availability, increases toxic element activity, and requires liming to restore optimal pH for crop production.",
      difficulty: "Hard"
    },
    {
      id: "agr12_soil_h3",
      question: "Evaluate the role of precision agriculture in soil fertility management.",
      options: ["Not applicable to soil management", "Enables site-specific nutrient management and optimization", "Only useful for large farms", "Replaces soil testing completely"],
      correct: "Enables site-specific nutrient management and optimization",
      explanation: "Precision agriculture uses GPS and soil mapping to apply nutrients based on specific field variability, optimizing fertility management.",
      difficulty: "Hard"
    },
    {
      id: "agr12_soil_h4",
      question: "Design an integrated approach to manage soil salinity in irrigated agriculture.",
      options: ["Ignore salinity problems", "Combine drainage, leaching, and salt-tolerant crops", "Use only fresh water", "Stop irrigation completely"],
      correct: "Combine drainage, leaching, and salt-tolerant crops",
      explanation: "Salinity management requires adequate drainage, periodic leaching, selection of salt-tolerant crops, and improved irrigation practices.",
      difficulty: "Hard"
    },
    {
      id: "agr12_soil_h5",
      question: "What is the most critical factor in carbon sequestration in agricultural soils?",
      options: ["Using only inorganic fertilizers", "Increasing organic matter inputs and reducing soil disturbance", "Maximum tillage frequency", "Removing all crop residues"],
      correct: "Increasing organic matter inputs and reducing soil disturbance",
      explanation: "Carbon sequestration requires increased organic inputs through cover crops, reduced tillage, and practices that build soil organic matter.",
      difficulty: "Hard"
    },
    {
      id: "agr12_soil_h6",
      question: "Analyze the complex interactions between soil pH, organic matter, and nutrient cycling.",
      options: ["These factors work independently", "pH influences organic matter decomposition and nutrient availability in complex ways", "Only pH matters for nutrients", "Organic matter has no effect"],
      correct: "pH influences organic matter decomposition and nutrient availability in complex ways",
      explanation: "Soil pH affects microbial activity, organic matter decomposition rates, and chemical reactions that influence nutrient cycling and availability.",
      difficulty: "Hard"
    },
    {
      id: "agr12_soil_h7",
      question: "Design a soil health assessment protocol for sustainable agriculture systems.",
      options: ["Test only chemical properties", "Integrate physical, chemical, and biological indicators", "Focus only on crop yields", "Use visual assessment only"],
      correct: "Integrate physical, chemical, and biological indicators",
      explanation: "Comprehensive soil health assessment requires measuring physical structure, chemical properties, and biological activity indicators.",
      difficulty: "Hard"
    },
    {
      id: "agr12_soil_h8",
      question: "Evaluate the potential of biochar for soil improvement in smallholder farming systems.",
      options: ["No benefits for soil", "Can improve soil fertility and carbon storage with proper application", "Only useful in research", "Harmful to soil organisms"],
      correct: "Can improve soil fertility and carbon storage with proper application",
      explanation: "Biochar can enhance soil fertility, increase carbon storage, and improve soil physical properties when properly produced and applied.",
      difficulty: "Hard"
    },
    {
      id: "agr12_soil_h9",
      question: "What is the most effective strategy for managing soil-borne pathogens?",
      options: ["Use only chemical treatments", "Integrate crop rotation, organic amendments, and biological control", "Ignore pathogen problems", "Sterilize all soil"],
      correct: "Integrate crop rotation, organic amendments, and biological control",
      explanation: "Soil-borne pathogen management requires integrated approaches including diverse rotations, organic matter additions, and beneficial microorganisms.",
      difficulty: "Hard"
    },
    {
      id: "agr12_soil_h10",
      question: "Analyze the role of mycorrhizal fungi in sustainable soil fertility management.",
      options: ["Harmful to plant growth", "Enhance nutrient uptake and soil structure through symbiotic relationships", "Only affect organic farms", "Have no practical importance"],
      correct: "Enhance nutrient uptake and soil structure through symbiotic relationships",
      explanation: "Mycorrhizal fungi form symbiotic relationships with plant roots, improving nutrient and water uptake while enhancing soil aggregation.",
      difficulty: "Hard"
    }
  ],
  "Unit 4: Agricultural Economics": [
    {
      id: "agr12_econ_e1",
      question: "What is the main goal of agricultural marketing?",
      options: ["To increase production costs", "To efficiently move products from producers to consumers", "To reduce crop yields", "To eliminate competition"],
      correct: "To efficiently move products from producers to consumers",
      explanation: "Agricultural marketing aims to efficiently transfer agricultural products from producers to consumers while adding value and ensuring fair prices.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_e2",
      question: "What does 'value addition' mean in agriculture?",
      options: ["Reducing crop quality", "Processing raw materials to increase their market value", "Decreasing production", "Selling at lower prices"],
      correct: "Processing raw materials to increase their market value",
      explanation: "Value addition involves processing, packaging, or transforming raw agricultural products to increase their market value and profitability.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_e3",
      question: "What is profit in agriculture?",
      options: ["Total income only", "Income minus expenses", "Production costs only", "Market prices only"],
      correct: "Income minus expenses",
      explanation: "Profit is calculated by subtracting all production expenses from the total income generated from agricultural activities.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_e4",
      question: "Which of the following is a fixed cost in farming?",
      options: ["Seeds", "Fertilizer", "Land rent", "Fuel"],
      correct: "Land rent",
      explanation: "Land rent is a fixed cost that doesn't vary with the level of production, unlike variable costs such as seeds and fertilizer.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_e5",
      question: "What is a market in agricultural context?",
      options: ["Only physical locations", "Any place where buyers and sellers exchange agricultural products", "Government offices", "Storage facilities"],
      correct: "Any place where buyers and sellers exchange agricultural products",
      explanation: "A market includes any mechanism or place where agricultural products are bought and sold, including physical and virtual platforms.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_e6",
      question: "What is demand in economics?",
      options: ["The supply of products", "The willingness and ability to buy products at various prices", "Production capacity", "Storage requirements"],
      correct: "The willingness and ability to buy products at various prices",
      explanation: "Demand represents consumers' willingness and ability to purchase products at different price levels during a specific period.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_e7",
      question: "Which factor directly affects farm income?",
      options: ["Weather only", "Production quantity and market prices", "Government policies only", "Transportation only"],
      correct: "Production quantity and market prices",
      explanation: "Farm income is directly determined by the quantity of products sold and the prices received in the market.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_e8",
      question: "What is agricultural credit?",
      options: ["Free money", "Borrowed funds for farming activities", "Government subsidies", "Insurance payments"],
      correct: "Borrowed funds for farming activities",
      explanation: "Agricultural credit refers to loans and borrowed funds used to finance farming operations, equipment, and inputs.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_e9",
      question: "What is the primary purpose of agricultural insurance?",
      options: ["Increase production", "Protect against financial losses from risks", "Reduce labor costs", "Improve soil quality"],
      correct: "Protect against financial losses from risks",
      explanation: "Agricultural insurance protects farmers against financial losses caused by weather, pests, diseases, and other production risks.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_e10",
      question: "What is subsistence farming?",
      options: ["Commercial large-scale farming", "Farming primarily for family consumption", "Export-oriented farming", "Industrial farming"],
      correct: "Farming primarily for family consumption",
      explanation: "Subsistence farming focuses on producing food primarily for the farmer's family consumption rather than commercial sale.",
      difficulty: "Easy"
    },
    {
      id: "agr12_econ_m1",
      question: "How do cooperatives benefit smallholder farmers?",
      options: ["Increase individual costs", "Provide collective bargaining power and shared resources", "Reduce production efficiency", "Eliminate market access"],
      correct: "Provide collective bargaining power and shared resources",
      explanation: "Cooperatives enable farmers to pool resources, access better prices through collective bargaining, share costs, and gain access to markets and services.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_m2",
      question: "What factors influence agricultural commodity prices?",
      options: ["Only weather conditions", "Supply and demand, weather, transportation costs, and government policies", "Only government policies", "Only production costs"],
      correct: "Supply and demand, weather, transportation costs, and government policies",
      explanation: "Agricultural prices are influenced by multiple factors including supply-demand dynamics, weather patterns, transportation costs, storage facilities, and government policies.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_m3",
      question: "What is the role of middlemen in agricultural marketing?",
      options: ["They only increase costs", "They facilitate trade by connecting producers and consumers", "They reduce market efficiency", "They have no economic function"],
      correct: "They facilitate trade by connecting producers and consumers",
      explanation: "Middlemen perform important functions including assembling products, transportation, storage, and connecting producers with consumers.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_m4",
      question: "How does price elasticity affect agricultural products?",
      options: ["Has no impact on agriculture", "Determines how quantity demanded responds to price changes", "Only affects luxury goods", "Controls production costs"],
      correct: "Determines how quantity demanded responds to price changes",
      explanation: "Price elasticity measures how responsive consumers are to price changes, affecting demand patterns for agricultural products.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_m5",
      question: "What is the significance of economies of scale in agriculture?",
      options: ["Only applies to small farms", "Larger operations can reduce per-unit costs", "Has no economic relevance", "Only affects labor costs"],
      correct: "Larger operations can reduce per-unit costs",
      explanation: "Economies of scale allow larger farming operations to spread fixed costs over more units, reducing average production costs.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_m6",
      question: "What is market information and why is it important for farmers?",
      options: ["Irrelevant to farming", "Data about prices and market conditions that guide decision-making", "Only about weather", "Government regulations only"],
      correct: "Data about prices and market conditions that guide decision-making",
      explanation: "Market information includes price data, demand trends, and market conditions that help farmers make informed production and marketing decisions.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_m7",
      question: "How do government subsidies affect agricultural production?",
      options: ["Have no impact", "Can encourage or discourage certain crops and practices", "Only benefit large farms", "Always reduce efficiency"],
      correct: "Can encourage or discourage certain crops and practices",
      explanation: "Subsidies influence farmer decision-making by altering the relative profitability of different crops and farming practices.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_m8",
      question: "What is contract farming and its benefits?",
      options: ["Farming without agreements", "Pre-arranged agreements between farmers and buyers", "Government-controlled farming", "Subsistence farming only"],
      correct: "Pre-arranged agreements between farmers and buyers",
      explanation: "Contract farming involves agreements that specify price, quality, and quantity, providing farmers with market security and input access.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_m9",
      question: "What role does transportation play in agricultural marketing?",
      options: ["No significant role", "Affects market access and product prices", "Only matters for exports", "Reduces product quality"],
      correct: "Affects market access and product prices",
      explanation: "Transportation costs and infrastructure significantly influence farmers' market access and the final prices of agricultural products.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_m10",
      question: "How do seasonal price variations affect farmer income?",
      options: ["Prices never vary seasonally", "Create opportunities for storage and strategic selling", "Always reduce income", "Only affect export crops"],
      correct: "Create opportunities for storage and strategic selling",
      explanation: "Seasonal price patterns allow farmers to increase income through strategic timing of sales and proper storage management.",
      difficulty: "Medium"
    },
    {
      id: "agr12_econ_h1",
      question: "Analyze the role of agricultural finance in transforming subsistence farming to commercial agriculture.",
      options: ["Finance has no role in transformation", "Access to credit enables investment in inputs, technology, and infrastructure", "Only large farms need finance", "Finance only increases debt burdens"],
      correct: "Access to credit enables investment in inputs, technology, and infrastructure",
      explanation: "Agricultural finance provides capital for farmers to invest in improved inputs, technology, and infrastructure, facilitating the transition from subsistence to commercial farming.",
      difficulty: "Hard"
    },
    {
      id: "agr12_econ_h2",
      question: "Evaluate the impact of global trade policies on Ethiopian agricultural exports.",
      options: ["No impact on local agriculture", "Significantly affect market access and competitiveness", "Only benefit importing countries", "Have uniform effects on all crops"],
      correct: "Significantly affect market access and competitiveness",
      explanation: "Global trade policies, tariffs, and agreements significantly influence Ethiopian farmers' access to international markets and export competitiveness.",
      difficulty: "Hard"
    },
    {
      id: "agr12_econ_h3",
      question: "Design a comprehensive agricultural value chain for coffee in Ethiopia.",
      options: ["Focus only on production", "Integrate production, processing, marketing, and export with stakeholder coordination", "Eliminate intermediaries completely", "Ignore quality considerations"],
      correct: "Integrate production, processing, marketing, and export with stakeholder coordination",
      explanation: "Effective value chains integrate all stages from production to export, ensuring quality, fair prices, and coordination among stakeholders.",
      difficulty: "Hard"
    },
    {
      id: "agr12_econ_h4",
      question: "Analyze the economic implications of climate change on agricultural productivity.",
      options: ["No economic consequences", "Affects yields, input costs, and requires adaptation investments", "Only benefits agriculture", "Impacts are negligible"],
      correct: "Affects yields, input costs, and requires adaptation investments",
      explanation: "Climate change impacts agricultural economics through altered yields, changed input requirements, and necessary investments in adaptation strategies.",
      difficulty: "Hard"
    },
    {
      id: "agr12_econ_h5",
      question: "What is the most effective approach to agricultural risk management for smallholder farmers?",
      options: ["Ignore risks completely", "Diversify income sources and use insurance products", "Focus only on production risks", "Rely solely on government support"],
      correct: "Diversify income sources and use insurance products",
      explanation: "Comprehensive risk management combines income diversification, insurance products, and financial planning to protect against various agricultural risks.",
      difficulty: "Hard"
    },
    {
      id: "agr12_econ_h6",
      question: "Evaluate the role of digital technology in agricultural market development.",
      options: ["Technology has no role in markets", "Improves market information access and reduces transaction costs", "Only benefits large agribusiness", "Eliminates need for physical markets"],
      correct: "Improves market information access and reduces transaction costs",
      explanation: "Digital technologies enhance market efficiency by providing real-time information, reducing transaction costs, and connecting farmers directly with buyers.",
      difficulty: "Hard"
    },
    {
      id: "agr12_econ_h7",
      question: "Design an economic model for sustainable agricultural intensification.",
      options: ["Focus only on increasing inputs", "Balance productivity increases with environmental and economic sustainability", "Ignore environmental costs", "Maximize short-term profits only"],
      correct: "Balance productivity increases with environmental and economic sustainability",
      explanation: "Sustainable intensification requires economic models that increase productivity while maintaining environmental sustainability and long-term profitability.",
      difficulty: "Hard"
    },
    {
      id: "agr12_econ_h8",
      question: "Analyze the economic factors influencing agricultural mechanization adoption.",
      options: ["Only equipment costs matter", "Labor costs, farm size, credit access, and expected returns influence adoption", "Government policies have no effect", "Technology is always profitable"],
      correct: "Labor costs, farm size, credit access, and expected returns influence adoption",
      explanation: "Mechanization adoption depends on complex economic factors including labor availability, farm scale, financing options, and return on investment.",
      difficulty: "Hard"
    },
    {
      id: "agr12_econ_h9",
      question: "What is the most critical factor in developing competitive agricultural export sectors?",
      options: ["Low production costs only", "Quality standards, market intelligence, and supply chain efficiency", "Government subsidies only", "Large farm sizes only"],
      correct: "Quality standards, market intelligence, and supply chain efficiency",
      explanation: "Export competitiveness requires meeting quality standards, understanding market demands, and maintaining efficient supply chains from farm to consumer.",
      difficulty: "Hard"
    },
    {
      id: "agr12_econ_h10",
      question: "Evaluate the economic potential of agricultural biotechnology for developing countries.",
      options: ["No economic benefits", "Can improve yields and reduce costs but requires careful assessment", "Always economically superior", "Only benefits developed countries"],
      correct: "Can improve yields and reduce costs but requires careful assessment",
      explanation: "Agricultural biotechnology offers economic potential through improved productivity and reduced input costs, but requires careful evaluation of costs, benefits, and risks.",
      difficulty: "Hard"
    }
  ],
  "Unit 5: Agricultural Technology": [
    {
      id: "agr12_tech_e1",
      question: "What is precision agriculture?",
      options: ["Farming with hand tools only", "Using technology to optimize field-level management", "Growing only one crop", "Traditional farming methods"],
      correct: "Using technology to optimize field-level management",
      explanation: "Precision agriculture uses GPS, sensors, and data analysis to optimize field-level management regarding crop farming for maximum efficiency and sustainability.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_e2",
      question: "Which technology helps farmers monitor soil moisture levels?",
      options: ["Tractors", "Soil moisture sensors", "Harvesting machines", "Storage facilities"],
      correct: "Soil moisture sensors",
      explanation: "Soil moisture sensors provide real-time data about soil water content, helping farmers optimize irrigation scheduling and water management.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_e3",
      question: "What is the primary benefit of GPS technology in farming?",
      options: ["Entertainment", "Precise field navigation and mapping", "Weather prediction", "Pest control"],
      correct: "Precise field navigation and mapping",
      explanation: "GPS technology enables accurate field mapping, precise equipment guidance, and location-specific farming practices.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_e4",
      question: "What is agricultural mechanization?",
      options: ["Using only hand tools", "Replacing human and animal power with machines", "Growing crops indoors", "Chemical farming"],
      correct: "Replacing human and animal power with machines",
      explanation: "Agricultural mechanization involves using machines and equipment to replace manual labor and animal power in farming operations.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_e5",
      question: "Which device is commonly used for weather monitoring on farms?",
      options: ["Microscope", "Weather station", "Calculator", "Scale"],
      correct: "Weather station",
      explanation: "Weather stations collect data on temperature, humidity, rainfall, and other weather parameters important for farming decisions.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_e6",
      question: "What is the main advantage of mobile apps in agriculture?",
      options: ["Entertainment only", "Providing farming information and tools", "Replacing farmers", "Increasing costs"],
      correct: "Providing farming information and tools",
      explanation: "Agricultural mobile apps provide farmers with access to weather data, market prices, farming advice, and decision-making tools.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_e7",
      question: "Which technology is used for automated irrigation?",
      options: ["Manual sprinklers", "Smart irrigation controllers", "Hand watering", "Traditional channels"],
      correct: "Smart irrigation controllers",
      explanation: "Smart irrigation controllers use sensors and timers to automatically control water application based on soil moisture and weather conditions.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_e8",
      question: "What is remote sensing in agriculture?",
      options: ["Touching plants directly", "Using satellites or drones to monitor crops", "Manual field inspection", "Underground monitoring"],
      correct: "Using satellites or drones to monitor crops",
      explanation: "Remote sensing uses aerial or satellite imagery to monitor crop health, growth patterns, and field conditions from a distance.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_e9",
      question: "Which technology helps in variable rate application of fertilizers?",
      options: ["Manual broadcasting", "GPS-guided spreaders", "Hand application", "Traditional methods"],
      correct: "GPS-guided spreaders",
      explanation: "GPS-guided spreaders can vary fertilizer application rates across fields based on soil testing and mapping data.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_e10",
      question: "What is the benefit of using tractors in farming?",
      options: ["Increased labor requirements", "Reduced efficiency and speed", "Increased efficiency and reduced labor", "Higher costs only"],
      correct: "Increased efficiency and reduced labor",
      explanation: "Tractors increase farming efficiency by completing tasks faster than manual labor while reducing the need for human workers.",
      difficulty: "Easy"
    },
    {
      id: "agr12_tech_m1",
      question: "How do drones benefit modern agriculture?",
      options: ["Only for entertainment", "Crop monitoring, pest detection, and precision spraying", "Replacing all farm workers", "Only for large farms"],
      correct: "Crop monitoring, pest detection, and precision spraying",
      explanation: "Agricultural drones provide aerial crop monitoring, early pest and disease detection, precision spraying, and field mapping capabilities.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_m2",
      question: "What is the purpose of GPS technology in agriculture?",
      options: ["Entertainment only", "Precise field mapping and guided machinery operation", "Weather prediction", "Soil testing"],
      correct: "Precise field mapping and guided machinery operation",
      explanation: "GPS technology enables precise field mapping, automated machinery guidance, variable rate application of inputs, and accurate record keeping.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_m3",
      question: "How does Internet of Things (IoT) technology benefit farming?",
      options: ["No practical benefits", "Connects sensors and devices for real-time monitoring", "Only for indoor farming", "Increases complexity unnecessarily"],
      correct: "Connects sensors and devices for real-time monitoring",
      explanation: "IoT technology connects various sensors and devices to provide real-time monitoring of soil, weather, crops, and equipment conditions.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_m4",
      question: "What is the role of satellite imagery in precision agriculture?",
      options: ["Only for navigation", "Monitoring crop health and field variability", "Weather forecasting only", "Entertainment purposes"],
      correct: "Monitoring crop health and field variability",
      explanation: "Satellite imagery provides large-scale monitoring of crop health, growth patterns, and field variability for precision management decisions.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_m5",
      question: "How do automated greenhouse systems improve crop production?",
      options: ["They don't improve production", "Control environment conditions automatically for optimal growth", "Only reduce labor costs", "Work only for specific crops"],
      correct: "Control environment conditions automatically for optimal growth",
      explanation: "Automated greenhouse systems control temperature, humidity, lighting, and irrigation to maintain optimal growing conditions.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_m6",
      question: "What is the benefit of using robotics in agriculture?",
      options: ["Only increases costs", "Performs repetitive tasks with precision and consistency", "Replaces farmers completely", "Has no practical applications"],
      correct: "Performs repetitive tasks with precision and consistency",
      explanation: "Agricultural robots can perform tasks like harvesting, weeding, and planting with high precision and consistency, reducing labor needs.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_m7",
      question: "How does data analytics help in farm management?",
      options: ["Complicates decision making", "Analyzes farm data to optimize decisions", "Only useful for large farms", "Has no practical value"],
      correct: "Analyzes farm data to optimize decisions",
      explanation: "Data analytics processes information from various sources to help farmers make informed decisions about planting, fertilizing, and harvesting.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_m8",
      question: "What is the advantage of variable rate technology (VRT)?",
      options: ["Uses same rate everywhere", "Applies inputs at different rates based on field variability", "Only works for fertilizers", "Reduces precision"],
      correct: "Applies inputs at different rates based on field variability",
      explanation: "VRT allows farmers to apply seeds, fertilizers, and chemicals at different rates across fields based on soil conditions and crop needs.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_m9",
      question: "How do decision support systems help farmers?",
      options: ["Make decisions for farmers", "Provide information and analysis to support decision-making", "Replace farmer knowledge", "Only work for experts"],
      correct: "Provide information and analysis to support decision-making",
      explanation: "Decision support systems analyze data and provide recommendations while allowing farmers to make final decisions based on their experience.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_m10",
      question: "What is the role of blockchain technology in agricultural supply chains?",
      options: ["No relevance to agriculture", "Provides transparent and traceable product information", "Only for cryptocurrency", "Complicates supply chains"],
      correct: "Provides transparent and traceable product information",
      explanation: "Blockchain technology creates transparent, immutable records of agricultural products from farm to consumer, improving traceability and trust.",
      difficulty: "Medium"
    },
    {
      id: "agr12_tech_h1",
      question: "Evaluate the potential impact of artificial intelligence on sustainable agriculture practices.",
      options: ["AI has no agricultural applications", "AI can optimize resource use, predict outcomes, and enhance decision-making", "AI only increases costs", "AI replaces all human knowledge"],
      correct: "AI can optimize resource use, predict outcomes, and enhance decision-making",
      explanation: "AI enhances sustainable agriculture through predictive analytics, optimized resource allocation, automated monitoring, and data-driven decision making for improved efficiency and environmental stewardship.",
      difficulty: "Hard"
    },
    {
      id: "agr12_tech_h2",
      question: "Analyze the integration challenges of advanced technology in smallholder farming systems.",
      options: ["No integration challenges exist", "Requires addressing cost, infrastructure, and knowledge barriers", "Technology is always easily adopted", "Only large farms face challenges"],
      correct: "Requires addressing cost, infrastructure, and knowledge barriers",
      explanation: "Technology integration in smallholder systems faces challenges including high costs, limited infrastructure, inadequate training, and scale constraints.",
      difficulty: "Hard"
    },
    {
      id: "agr12_tech_h3",
      question: "Design a comprehensive smart farming system for climate-resilient agriculture.",
      options: ["Use only traditional methods", "Integrate sensors, AI, and automation for climate adaptation", "Focus only on high-tech solutions", "Ignore climate considerations"],
      correct: "Integrate sensors, AI, and automation for climate adaptation",
      explanation: "Climate-resilient smart farming integrates weather monitoring, predictive analytics, automated irrigation, and adaptive management systems.",
      difficulty: "Hard"
    },
    {
      id: "agr12_tech_h4",
      question: "Evaluate the economic viability of precision agriculture technologies for developing countries.",
      options: ["Always economically viable", "Requires careful cost-benefit analysis and adaptation to local conditions", "Never economically viable", "Only viable for export crops"],
      correct: "Requires careful cost-benefit analysis and adaptation to local conditions",
      explanation: "Economic viability of precision agriculture depends on local costs, farm sizes, crop values, and the availability of supporting infrastructure.",
      difficulty: "Hard"
    },
    {
      id: "agr12_tech_h5",
      question: "What is the most critical factor for successful digital transformation in agriculture?",
      options: ["Having the latest technology", "Farmer education and infrastructure development", "Government mandates only", "Foreign investment only"],
      correct: "Farmer education and infrastructure development",
      explanation: "Successful digital transformation requires educated farmers who can use technology effectively, supported by adequate infrastructure and connectivity.",
      difficulty: "Hard"
    },
    {
      id: "agr12_tech_h6",
      question: "Analyze the potential of gene editing technologies in crop improvement.",
      options: ["No potential for crop improvement", "Can accelerate development of climate-adapted and nutritious crops", "Only works in laboratories", "Eliminates need for traditional breeding"],
      correct: "Can accelerate development of climate-adapted and nutritious crops",
      explanation: "Gene editing technologies like CRISPR can rapidly develop crops with improved stress tolerance, disease resistance, and nutritional content.",
      difficulty: "Hard"
    },
    {
      id: "agr12_tech_h7",
      question: "Design an integrated pest management system using modern technology.",
      options: ["Use only chemical pesticides", "Combine sensors, AI prediction, and targeted interventions", "Rely only on biological control", "Ignore pest monitoring"],
      correct: "Combine sensors, AI prediction, and targeted interventions",
      explanation: "Modern IPM systems integrate pest monitoring sensors, AI-based prediction models, and precision application technologies for sustainable pest control.",
      difficulty: "Hard"
    },
    {
      id: "agr12_tech_h8",
      question: "Evaluate the role of big data analytics in agricultural research and development.",
      options: ["No role in research", "Accelerates research through pattern recognition and predictive modeling", "Only useful for marketing", "Complicates research processes"],
      correct: "Accelerates research through pattern recognition and predictive modeling",
      explanation: "Big data analytics enables researchers to identify patterns, predict outcomes, and develop improved varieties and practices faster than traditional methods.",
      difficulty: "Hard"
    },
    {
      id: "agr12_tech_h9",
      question: "What is the most promising approach for technology transfer to smallholder farmers?",
      options: ["Direct technology sales", "Participatory approaches with local adaptation and training", "Government mandates only", "One-size-fits-all solutions"],
      correct: "Participatory approaches with local adaptation and training",
      explanation: "Effective technology transfer requires participatory approaches that adapt technologies to local conditions while providing comprehensive training and support.",
      difficulty: "Hard"
    },
    {
      id: "agr12_tech_h10",
      question: "Analyze the potential of vertical farming for addressing food security challenges.",
      options: ["No potential for food security", "Can supplement traditional farming in urban areas and harsh environments", "Will replace all traditional farming", "Only suitable for luxury crops"],
      correct: "Can supplement traditional farming in urban areas and harsh environments",
      explanation: "Vertical farming can contribute to food security by producing fresh food in urban areas and environments where traditional farming is challenging, though it supplements rather than replaces field agriculture.",
      difficulty: "Hard"
    }
  ],
  "Unit 6: Sustainable Agriculture": [
    {
      id: "agr12_sustain_e1",
      question: "What is sustainable agriculture?",
      options: ["Farming that depletes soil", "Farming that meets current needs without compromising future generations", "Using only chemicals", "Maximum production regardless of impact"],
      correct: "Farming that meets current needs without compromising future generations",
      explanation: "Sustainable agriculture meets present food needs while preserving environmental resources and maintaining farm profitability for future generations.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_e2",
      question: "Which practice helps reduce chemical pesticide use?",
      options: ["Monoculture farming", "Integrated pest management", "Increased tillage", "Removing all insects"],
      correct: "Integrated pest management",
      explanation: "Integrated pest management combines biological, cultural, and chemical methods to control pests while minimizing pesticide use and environmental impact.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_e3",
      question: "What is organic farming?",
      options: ["Using synthetic chemicals", "Farming without synthetic pesticides and fertilizers", "Indoor farming only", "Genetically modified crops"],
      correct: "Farming without synthetic pesticides and fertilizers",
      explanation: "Organic farming avoids synthetic pesticides, fertilizers, and GMOs while emphasizing natural processes and biodiversity conservation.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_e4",
      question: "Which crop rotation benefit helps sustainability?",
      options: ["Soil depletion", "Breaking pest cycles and maintaining soil fertility", "Increased chemical use", "Reduced biodiversity"],
      correct: "Breaking pest cycles and maintaining soil fertility",
      explanation: "Crop rotation breaks pest and disease cycles while different crops contribute various nutrients and organic matter to soil health.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_e5",
      question: "What is composting?",
      options: ["Burning organic waste", "Decomposing organic matter to create fertilizer", "Using synthetic materials", "Storing crops"],
      correct: "Decomposing organic matter to create fertilizer",
      explanation: "Composting decomposes organic materials like crop residues and animal manure to create nutrient-rich natural fertilizer.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_e6",
      question: "Which practice conserves water in agriculture?",
      options: ["Flood irrigation", "Drip irrigation", "Overwatering", "Open channel irrigation"],
      correct: "Drip irrigation",
      explanation: "Drip irrigation delivers water directly to plant roots, minimizing water waste and improving water use efficiency.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_e7",
      question: "What is biodiversity in agriculture?",
      options: ["Growing only one crop", "Variety of plants, animals, and microorganisms", "Using chemicals only", "Eliminating all insects"],
      correct: "Variety of plants, animals, and microorganisms",
      explanation: "Biodiversity includes the variety of crops, beneficial insects, soil organisms, and wildlife that contribute to ecosystem health.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_e8",
      question: "Which practice prevents soil erosion?",
      options: ["Leaving soil bare", "Cover cropping", "Excessive tillage", "Steep slope farming"],
      correct: "Cover cropping",
      explanation: "Cover crops protect soil surface from erosion by wind and water while adding organic matter to improve soil structure.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_e9",
      question: "What is the main goal of conservation agriculture?",
      options: ["Maximum tillage", "Protecting soil health and reducing erosion", "Using more chemicals", "Eliminating crop diversity"],
      correct: "Protecting soil health and reducing erosion",
      explanation: "Conservation agriculture focuses on minimal soil disturbance, permanent soil cover, and crop rotation to maintain soil health.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_e10",
      question: "Which renewable energy source is commonly used in sustainable farming?",
      options: ["Coal", "Solar power", "Nuclear energy", "Natural gas"],
      correct: "Solar power",
      explanation: "Solar power provides clean, renewable energy for irrigation pumps, lighting, and other farm operations in sustainable systems.",
      difficulty: "Easy"
    },
    {
      id: "agr12_sustain_m1",
      question: "How does agroforestry contribute to sustainable agriculture?",
      options: ["Reduces biodiversity", "Combines trees with crops for multiple benefits", "Eliminates crop production", "Only provides timber"],
      correct: "Combines trees with crops for multiple benefits",
      explanation: "Agroforestry integrates trees with crops and/or livestock, providing soil conservation, biodiversity, carbon sequestration, and diversified income sources.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_m2",
      question: "What is the role of biodiversity in sustainable farming systems?",
      options: ["Biodiversity is unnecessary", "Enhances ecosystem stability and resilience", "Only complicates farming", "Reduces productivity"],
      correct: "Enhances ecosystem stability and resilience",
      explanation: "Biodiversity strengthens ecosystem stability, provides natural pest control, improves soil health, and increases system resilience to environmental stresses.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_m3",
      question: "How do green manures contribute to sustainable agriculture?",
      options: ["They deplete soil nutrients", "Provide nitrogen and organic matter to soil", "Increase pest problems", "Only work in greenhouses"],
      correct: "Provide nitrogen and organic matter to soil",
      explanation: "Green manures are crops grown specifically to be incorporated into soil, providing nitrogen fixation and organic matter for soil improvement.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_m4",
      question: "What is the principle behind biological pest control?",
      options: ["Using more pesticides", "Using natural enemies to control pests", "Eliminating all insects", "Chemical-only approach"],
      correct: "Using natural enemies to control pests",
      explanation: "Biological pest control uses natural predators, parasites, and pathogens to control pest populations without synthetic chemicals.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_m5",
      question: "How does no-till farming support sustainability?",
      options: ["Increases soil erosion", "Preserves soil structure and reduces erosion", "Requires more fuel", "Reduces crop yields"],
      correct: "Preserves soil structure and reduces erosion",
      explanation: "No-till farming maintains soil structure, reduces erosion, conserves moisture, and builds organic matter while reducing fuel consumption.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_m6",
      question: "What is permaculture and its relevance to sustainable agriculture?",
      options: ["Temporary farming only", "Design system mimicking natural ecosystems", "Industrial farming method", "Chemical-intensive approach"],
      correct: "Design system mimicking natural ecosystems",
      explanation: "Permaculture designs agricultural systems that mimic natural ecosystems, emphasizing sustainability, diversity, and ecological relationships.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_m7",
      question: "How does water harvesting support sustainable farming?",
      options: ["Wastes water resources", "Collects and stores rainwater for irrigation", "Increases water pollution", "Only works in wet areas"],
      correct: "Collects and stores rainwater for irrigation",
      explanation: "Water harvesting captures and stores rainwater for later use in irrigation, reducing dependence on groundwater and improving water security.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_m8",
      question: "What role do beneficial microorganisms play in sustainable agriculture?",
      options: ["They cause plant diseases", "Improve soil fertility and plant health", "Compete with crops for nutrients", "Have no beneficial effects"],
      correct: "Improve soil fertility and plant health",
      explanation: "Beneficial microorganisms improve nutrient cycling, fix nitrogen, suppress diseases, and enhance plant growth in sustainable systems.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_m9",
      question: "How does integrated farming systems approach sustainability?",
      options: ["Focus on single enterprise", "Combine multiple farm enterprises for efficiency", "Use only modern technology", "Ignore environmental factors"],
      correct: "Combine multiple farm enterprises for efficiency",
      explanation: "Integrated farming combines crops, livestock, and other enterprises to maximize resource use efficiency and create synergistic benefits.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_m10",
      question: "What is carbon sequestration in agriculture?",
      options: ["Releasing carbon to atmosphere", "Storing carbon in soil and plants", "Using more fossil fuels", "Ignoring climate change"],
      correct: "Storing carbon in soil and plants",
      explanation: "Carbon sequestration captures and stores atmospheric carbon dioxide in soil organic matter and plant biomass, mitigating climate change.",
      difficulty: "Medium"
    },
    {
      id: "agr12_sustain_h1",
      question: "Design a comprehensive sustainable farming system for smallholder farmers in semi-arid regions.",
      options: ["Focus only on irrigation", "Integrate water conservation, drought-resistant crops, and livestock", "Use maximum external inputs", "Abandon farming in dry areas"],
      correct: "Integrate water conservation, drought-resistant crops, and livestock",
      explanation: "Sustainable farming in semi-arid regions requires integrated approaches including rainwater harvesting, drought-tolerant crops, efficient irrigation, and complementary livestock systems.",
      difficulty: "Hard"
    },
    {
      id: "agr12_sustain_h2",
      question: "Analyze the long-term environmental impacts of intensive agricultural systems.",
      options: ["No environmental impacts", "Can cause soil degradation, water pollution, and biodiversity loss", "Always improve environment", "Only have positive effects"],
      correct: "Can cause soil degradation, water pollution, and biodiversity loss",
      explanation: "Intensive agriculture can lead to soil degradation, groundwater contamination, reduced biodiversity, and ecosystem disruption without proper management.",
      difficulty: "Hard"
    },
    {
      id: "agr12_sustain_h3",
      question: "Evaluate the potential of regenerative agriculture in addressing climate change.",
      options: ["Has no climate impact", "Can sequester carbon while improving soil health and productivity", "Only increases emissions", "Is economically impossible"],
      correct: "Can sequester carbon while improving soil health and productivity",
      explanation: "Regenerative agriculture practices can sequester atmospheric carbon in soils while improving soil health, water retention, and farm productivity.",
      difficulty: "Hard"
    },
    {
      id: "agr12_sustain_h4",
      question: "Design an integrated approach to manage agricultural biodiversity conservation.",
      options: ["Eliminate all wildlife", "Combine on-farm conservation with landscape management", "Focus only on crop varieties", "Ignore genetic diversity"],
      correct: "Combine on-farm conservation with landscape management",
      explanation: "Biodiversity conservation requires integrated approaches including crop diversity, habitat conservation, wildlife corridors, and landscape-level planning.",
      difficulty: "Hard"
    },
    {
      id: "agr12_sustain_h5",
      question: "What is the most effective strategy for transitioning from conventional to sustainable agriculture?",
      options: ["Immediate complete change", "Gradual transition with farmer education and support", "Government mandates only", "Economic incentives only"],
      correct: "Gradual transition with farmer education and support",
      explanation: "Successful transition requires gradual implementation with comprehensive farmer education, technical support, and economic incentives to manage risks.",
      difficulty: "Hard"
    },
    {
      id: "agr12_sustain_h6",
      question: "Analyze the role of traditional ecological knowledge in sustainable agriculture development.",
      options: ["Traditional knowledge is outdated", "Combines indigenous wisdom with modern science for innovation", "Should be completely replaced", "Has no scientific value"],
      correct: "Combines indigenous wisdom with modern science for innovation",
      explanation: "Traditional ecological knowledge provides valuable insights that, when combined with modern science, can lead to innovative sustainable farming practices.",
      difficulty: "Hard"
    },
    {
      id: "agr12_sustain_h7",
      question: "Evaluate the economic viability of sustainable agriculture practices for smallholder farmers.",
      options: ["Always unprofitable", "Can be profitable with proper planning and market access", "Only viable for large farms", "Requires permanent subsidies"],
      correct: "Can be profitable with proper planning and market access",
      explanation: "Sustainable practices can be economically viable through reduced input costs, premium markets, improved soil health, and long-term productivity benefits.",
      difficulty: "Hard"
    },
    {
      id: "agr12_sustain_h8",
      question: "Design a circular agriculture system that minimizes waste and maximizes resource efficiency.",
      options: ["Linear input-output system", "Closed-loop system recycling all outputs as inputs", "Waste disposal focus", "Maximum external inputs"],
      correct: "Closed-loop system recycling all outputs as inputs",
      explanation: "Circular agriculture creates closed-loop systems where waste from one component becomes input for another, minimizing waste and maximizing efficiency.",
      difficulty: "Hard"
    },
    {
      id: "agr12_sustain_h9",
      question: "What is the most critical challenge in scaling up sustainable agriculture practices?",
      options: ["Technical limitations only", "Coordinating knowledge, policy, and market systems", "Lack of farmer interest", "Insufficient technology"],
      correct: "Coordinating knowledge, policy, and market systems",
      explanation: "Scaling sustainable agriculture requires coordinated efforts in research, extension, policy support, market development, and farmer capacity building.",
      difficulty: "Hard"
    },
    {
      id: "agr12_sustain_h10",
      question: "Analyze the integration of digital technology with sustainable agriculture principles.",
      options: ["Technology opposes sustainability", "Technology can optimize resource use and environmental monitoring", "Only manual methods are sustainable", "Digital solutions increase environmental impact"],
      correct: "Technology can optimize resource use and environmental monitoring",
      explanation: "Digital technologies can enhance sustainability through precision resource management, environmental monitoring, and data-driven decisions that reduce waste and environmental impact.",
      difficulty: "Hard"
    }
  ]
};

// Helper function to get questions by difficulty for agriculture
export const getGrade12AgricultureQuestions = (unit: string, difficulty: 'Easy' | 'Medium' | 'Hard'): Question[] => {
  const unitQuestions = grade12AgricultureQuestions[unit] || [];
  return unitQuestions.filter(q => q.difficulty === difficulty);
};

// Export all agriculture questions as a flat array
export const allGrade12AgricultureQuestions = Object.values(grade12AgricultureQuestions).flat();
