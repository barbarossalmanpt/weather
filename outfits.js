function getOutfit(tempC, weatherCode, windKmh, style = 'minimalist', occasion = 'everyday') {
    let tempCategory;
    if (tempC < 5) tempCategory = 'freezing';
    else if (tempC < 12) tempCategory = 'cold';
    else if (tempC < 18) tempCategory = 'mild';
    else if (tempC < 24) tempCategory = 'warm';
    else tempCategory = 'hot';

    const wardrobe = {
        minimalist: {
            everyday: {
                freezing: { label: "SCANDI WINTER", items: ["🧥 Wool Overcoat", "🧶 Heavy Turtleneck", "👖 Straight Denim", "🥾 Chelsea Boots"], illustration: "❄️" },
                cold: { label: "CLEAN LAYERS", items: ["🧥 Mac Coat", "👕 Fine Knitwear", "👖 Chinos", "👟 White Sneakers"], illustration: "🍂" },
                mild: { label: "EFFORTLESS", items: ["🧥 Light Trench", "👕 Crisp White Tee", "👖 Selvedge Jeans", "👞 Loafers"], illustration: "⛅" },
                warm: { label: "ELEVATED BASICS", items: ["👔 Linen Button-up", "👖 Tailored Trousers", "👟 Minimal Sneakers"], illustration: "🌤️" },
                hot: { label: "SUMMER UNIFORM", items: ["👕 Heavyweight Tee", "🩳 Tailored Shorts", "🕶️ Classic Shades", "👞 Suede Loafers"], illustration: "☀️" }
            },
            office: {
                freezing: { label: "WINTER COMMUTE", items: ["🧥 Cashmere Overcoat", "👔 Oxford Shirt", "🧶 V-Neck Sweater", "👖 Wool Trousers", "👞 Brogues"], illustration: "❄️" },
                cold: { label: "BUSINESS SHARP", items: ["🧥 Peacoat", "👔 Button-down Shirt", "👖 Dress Pants", "👞 Oxford Shoes"], illustration: "🍂" },
                mild: { label: "SMART TRANSITION", items: ["🧥 Unstructured Blazer", "👕 Fine Gauge Polo", "👖 Chinos", "👞 Derbies"], illustration: "⛅" },
                warm: { label: "SUMMER OFFICE", items: ["👔 Light Cotton Shirt", "👖 Linen Blend Trousers", "👞 Loafers"], illustration: "🌤️" },
                hot: { label: "HEATWAVE WORK", items: ["👔 Short-sleeve Button-up", "👖 Breathable Chinos", "🕶️ Sunglasses", "👞 Unlined Loafers"], illustration: "☀️" }
            },
            night_out: {
                freezing: { label: "EVENING CHILL", items: ["🧥 Dark Overcoat", "🧶 Black Turtleneck", "👖 Black Denim", "🥾 Chelsea Boots"], illustration: "❄️" },
                cold: { label: "DUSK LAYERS", items: ["🧥 Leather Jacket", "👕 Dark Crewneck", "👖 Slim Jeans", "🥾 Zip Boots"], illustration: "🍂" },
                mild: { label: "NIGHT RIDER", items: ["🧥 Suede Bomber", "👕 Black Tee", "👖 Dark Trousers", "👞 Loafers"], illustration: "⛅" },
                warm: { label: "SUNSET DRINKS", items: ["👔 Silk Blend Shirt", "👖 Tailored Trousers", "👟 Clean Sneakers"], illustration: "🌤️" },
                hot: { label: "MIDNIGHT HEAT", items: ["👔 Open Collar Shirt", "👖 Light Trousers", "🕶️ Evening Shades", "👞 Suede Loafers"], illustration: "☀️" }
            }
        },
        streetwear: {
            everyday: {
                freezing: { label: "ARCTIC HYPE", items: ["🧥 Heavy Puffer", "👕 Graphic Hoodie", "👖 Baggy Cargos", "👟 High-top Sneakers"], illustration: "❄️" },
                cold: { label: "STREET LAYERS", items: ["🧥 Varsity Jacket", "👕 Vintage Sweatshirt", "👖 Wide Leg Denim", "👟 Chunky Sneakers"], illustration: "🍂" },
                mild: { label: "MID-SEASON", items: ["🧥 Coach Jacket", "👕 Graphic Tee", "👖 Parachute Pants", "👟 Retro Runners"], illustration: "⛅" },
                warm: { label: "SUMMER STEPS", items: ["👕 Oversized Graphic Tee", "🩳 Baggy Jorts", "👟 Skate Shoes", "🧢 Snapback"], illustration: "🌤️" },
                hot: { label: "HEATWAVE", items: ["👕 Mesh Jersey", "🩳 Nylon Shorts", "🕶️ Sport Shades", "👟 Slide Sandals"], illustration: "☀️" }
            },
            office: {
                freezing: { label: "CREATIVE AGENCY", items: ["🧥 Technical Parka", "🧶 Oversized Knit", "👖 Wide Trousers", "👟 Designer Sneakers"], illustration: "❄️" },
                cold: { label: "ELEVATED STREET", items: ["🧥 Puffer Vest", "👔 Oversized Button-down", "👖 Cargo Trousers", "👟 Premium Kicks"], illustration: "🍂" },
                mild: { label: "CASUAL FRIDAY", items: ["🧥 Zip-up Overshirt", "👕 Heavyweight Tee", "👖 Straight Chinos", "👟 Clean Runners"], illustration: "⛅" },
                warm: { label: "WARM COMMUTE", items: ["👔 Camp Collar Shirt", "👖 Wide Leg Pants", "👟 Canvas Sneakers"], illustration: "🌤️" },
                hot: { label: "SUMMER STUDIO", items: ["👕 Boxy Polo", "🩳 Longline Shorts", "🕶️ Trendy Shades", "👟 Slip-on Vans"], illustration: "☀️" }
            },
            night_out: {
                freezing: { label: "WINTER FUNCTION", items: ["🧥 Black Puffer", "👕 Zip-up Hoodie", "👖 Techwear Cargos", "🥾 Gore-Tex Boots"], illustration: "❄️" },
                cold: { label: "LATE NIGHTS", items: ["🧥 Track Jacket", "👕 Dark Graphic Tee", "👖 Baggy Denim", "👟 Reflective Sneakers"], illustration: "🍂" },
                mild: { label: "CITY LIGHTS", items: ["🧥 Oversized Flannel", "👕 Vintage Band Tee", "👖 Ripped Jeans", "👟 High-Tops"], illustration: "⛅" },
                warm: { label: "NIGHT MOVES", items: ["👕 Sleeveless Top", "👖 Cargo Pants", "👟 Chunky Kicks", "⛓️ Silver Chain"], illustration: "🌤️" },
                hot: { label: "CLUB HEAT", items: ["👕 Silky Button-up", "🩳 Dark Jorts", "🕶️ Tinted Glasses", "👟 Clean Whites"], illustration: "☀️" }
            }
        },
        smart_casual: {
            everyday: {
                freezing: { label: "WINTER SHARP", items: ["🧥 Tailored Overcoat", "🧶 Cable Knit Sweater", "👖 Dark Jeans", "🥾 Brogue Boots"], illustration: "❄️" },
                cold: { label: "CRISP AUTUMN", items: ["🧥 Quilted Jacket", "👕 Henley Shirt", "👖 Chinos", "👞 Chukka Boots"], illustration: "🍂" },
                mild: { label: "SPRING BREEZE", items: ["🧥 Harrington Jacket", "👕 Polo Shirt", "👖 Slim Jeans", "👞 Suede Loafers"], illustration: "⛅" },
                warm: { label: "WEEKEND SUN", items: ["👔 Linen Shirt", "👖 Light Chinos", "👞 Boat Shoes"], illustration: "🌤️" },
                hot: { label: "SUMMER CHILL", items: ["👕 High-quality Polo", "🩳 Tailored Shorts", "🕶️ Aviators", "👞 Woven Loafers"], illustration: "☀️" }
            },
            office: {
                freezing: { label: "BOARDROOM COLD", items: ["🧥 Heavy Trench Coat", "👔 Shirt & Tie", "🧶 Cardigan", "👖 Dress Trousers", "👞 Oxfords"], illustration: "❄️" },
                cold: { label: "BUSINESS READY", items: ["🧥 Tweed Blazer", "👔 Crisp Shirt", "👖 Wool Trousers", "👞 Monk Straps"], illustration: "🍂" },
                mild: { label: "EXECUTIVE CASUAL", items: ["🧥 Navy Blazer", "👔 Light Blue Shirt", "👖 Khaki Chinos", "👞 Derbies"], illustration: "⛅" },
                warm: { label: "WARM DESK", items: ["👔 Dress Shirt", "👖 Lightweight Trousers", "👞 Penny Loafers"], illustration: "🌤️" },
                hot: { label: "SUMMER BIZ", items: ["👔 Short-sleeve Dress Shirt", "👖 Breathable Trousers", "🕶️ Classic Shades", "👞 Unlined Shoes"], illustration: "☀️" }
            },
            night_out: {
                freezing: { label: "ELEGANT EVENING", items: ["🧥 Fur-lined Coat", "🧶 Fine Turtleneck", "👖 Tailored Trousers", "🥾 Dress Boots"], illustration: "❄️" },
                cold: { label: "DINNER DATE", items: ["🧥 Velvet Blazer", "👔 Dark Dress Shirt", "👖 Dark Denim", "👞 Double Monks"], illustration: "🍂" },
                mild: { label: "EVENING SHARP", items: ["🧥 Light Blazer", "👕 Premium Tee", "👖 Smart Chinos", "👞 Suede Tassels"], illustration: "⛅" },
                warm: { label: "PATIO DRINKS", items: ["👔 Patterned Silk Shirt", "👖 Light Trousers", "👞 Moccasins"], illustration: "🌤️" },
                hot: { label: "SUMMER NIGHTS", items: ["👔 Linen Button-down", "👖 Chinos", "🕶️ Stylish Shades", "👞 Espadrilles"], illustration: "☀️" }
            }
        }
    };

    let baseOutfit = wardrobe[style][occasion][tempCategory];

    // Deep copy to avoid mutating the original
    let outfit = {
        label: baseOutfit.label,
        items: [...baseOutfit.items],
        illustration: baseOutfit.illustration
    };

    // Weather code modifiers
    const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
    if (isRainy) {
        outfit.items.push("☂️ Umbrella");
        outfit.illustration = "🌧️";
    }

    // Wind modifier
    if (windKmh > 40) {
        if (style === 'streetwear') outfit.items.push("💨 Nylon Windbreaker");
        else if (style === 'smart_casual') outfit.items.push("💨 Trench Layer");
        else outfit.items.push("💨 Windproof Shell");
    }

    // Sun modifier
    const isSunny = (weatherCode === 0 || weatherCode === 1);
    if (isSunny && tempC > 24) {
        if (!outfit.items.some(i => i.includes('Shades') || i.includes('Sunglasses') || i.includes('Aviators'))) {
             outfit.items.push("🕶️ Sunglasses");
        }
    }

    return outfit;
}

// Expose to window for app.js without needing ES Modules
window.getOutfit = getOutfit;
