/**
 * Simple RAG Search using TF-IDF keyword matching
 * Vietnamese-aware, returns top-N most relevant knowledge chunks
 */

import knowledgeBase from './knowledgeBase.js';

// Vietnamese stop words to filter out
const STOP_WORDS = new Set([
  'là', 'và', 'của', 'có', 'được', 'cho', 'với', 'các', 'một', 'này',
  'những', 'để', 'trong', 'từ', 'khi', 'đã', 'sẽ', 'đang', 'không',
  'rất', 'cũng', 'như', 'nào', 'hay', 'hoặc', 'mà', 'thì', 'bạn',
  'tôi', 'anh', 'chị', 'em', 'ơi', 'nhé', 'nha', 'ạ', 'hả', 'vậy',
  'thế', 'đó', 'đây', 'ở', 'trên', 'dưới', 'ra', 'vào', 'lên', 'xuống',
  'the', 'is', 'are', 'was', 'were', 'a', 'an', 'and', 'or', 'but',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'it', 'this',
  'that', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'how', 'can',
  'do', 'does', 'did', 'the', 'be', 'been', 'being', 'have', 'has', 'had',
  'làm', 'sao', 'thế', 'nào', 'gì', 'ai', 'bao', 'nhiêu', 'lúc',
  'muốn', 'cần', 'phải', 'nên', 'hãy', 'xin', 'vui', 'lòng'
]);

/**
 * Tokenize and normalize text for matching
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Calculate relevance score between query and a knowledge entry
 * Uses keyword matching + title boost + category boost
 */
function calculateScore(queryTokens, entry) {
  const contentTokens = tokenize(entry.content);
  const titleTokens = tokenize(entry.title);
  const keywordTokens = entry.keywords.map(k => k.toLowerCase());

  let score = 0;

  for (const queryToken of queryTokens) {
    // Exact keyword match (highest weight)
    for (const keyword of keywordTokens) {
      if (keyword.includes(queryToken) || queryToken.includes(keyword)) {
        score += 10;
      }
    }

    // Title match (high weight)
    for (const titleToken of titleTokens) {
      if (titleToken === queryToken) {
        score += 5;
      } else if (titleToken.includes(queryToken) || queryToken.includes(titleToken)) {
        score += 3;
      }
    }

    // Content match (normal weight)
    for (const contentToken of contentTokens) {
      if (contentToken === queryToken) {
        score += 1;
      }
    }
  }

  // Normalize by query length to avoid bias toward longer queries
  return queryTokens.length > 0 ? score / queryTokens.length : 0;
}

/**
 * Search for the most relevant knowledge chunks
 * @param {string} query - User's question
 * @param {number} topN - Number of results to return (default: 3)
 * @returns {Array} Top-N relevant knowledge chunks with scores
 */
export function searchKnowledge(query, topN = 3) {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return [];
  }

  const scored = knowledgeBase.map(entry => ({
    ...entry,
    score: calculateScore(queryTokens, entry)
  }));

  // Sort by score descending, filter out zero scores
  return scored
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ id, category, title, content, score }) => ({
      id,
      category,
      title,
      content,
      score
    }));
}

export default searchKnowledge;
