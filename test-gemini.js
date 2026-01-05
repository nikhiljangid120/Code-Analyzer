// Test script with full error logging
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyARXqPJB5obtDf3HDFvE-CpSmW12JUN2I0";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
    try {
        console.log(`Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        console.log(`SUCCESS: ${result.response.text()}`);
        return true;
    } catch (error) {
        console.log(`FAILED: ${error.message}\n`);
        return false;
    }
}

async function main() {
    // Try the basic model
    await testModel("gemini-pro");
}

main();
