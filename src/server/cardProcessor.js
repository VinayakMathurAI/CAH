const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Function to process questions (black cards)
function processQuestions(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    const blackCards = lines.map(line => {
      // Count underscores to determine how many cards to pick
      const underscores = (line.match(/_/g) || []).length;
      // Default to 1 if no underscores or if the text contains a blank to fill
      const pick = Math.max(underscores || 1, 1);
      
      // Replace the _ with ____ for visual clarity
      let text = line.replace(/_/g, '____');
      
      return {
        id: uuidv4(),
        text,
        pick
      };
    });
    
    return blackCards;
  } catch (error) {
    console.error('Error processing questions:', error);
    return [];
  }
}

// Function to process answers (white cards)
function processAnswers(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    const whiteCards = lines.map(line => ({
      id: uuidv4(),
      text: line
    }));
    
    return whiteCards;
  } catch (error) {
    console.error('Error processing answers:', error);
    return [];
  }
}

// Process the cards
const blackCards = processQuestions(path.join(__dirname, '../../temp/against-humanity/questions.txt'));
const whiteCards = processAnswers(path.join(__dirname, '../../temp/against-humanity/answers.txt'));

// Write to file
fs.writeFileSync(
  path.join(__dirname, '../shared/cardsData.json'),
  JSON.stringify({ blackCards, whiteCards }, null, 2)
);

console.log(`Processed ${blackCards.length} black cards and ${whiteCards.length} white cards.`);