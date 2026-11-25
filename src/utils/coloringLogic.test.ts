import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCoverTitle,
  buildPagePrompt,
  validateBookInput,
  generateDemoBook,
  getVectorLineArtSvg
} from './coloringLogic';

test('formatCoverTitle generates customized child book title', () => {
  assert.equal(formatCoverTitle('Leo', 'space dinosaurs'), "Leo's space dinosaurs");
  assert.equal(formatCoverTitle('  Maya  ', 'deep ocean creatures'), "Maya's deep ocean creatures");
  assert.equal(formatCoverTitle('', ''), "Little Artist's Magical Adventures");
});

test('buildPagePrompt includes thick line art, white background and no shading requirements', () => {
  const prompt = buildPagePrompt('space dinosaurs', 'Captain T-Rex', 'T-Rex in a bubble helmet', 'kids');
  assert.ok(prompt.includes('Black and white line art only'));
  assert.ok(prompt.includes('bold thick black contour outlines'));
  assert.ok(prompt.includes('pure white background'));
  assert.ok(prompt.includes('no grayscale'));
  assert.ok(prompt.includes('no shading'));
  assert.ok(prompt.includes('Captain T-Rex'));
});

test('buildPagePrompt adapts to toddler vs older age group', () => {
  const toddlerPrompt = buildPagePrompt('space dinosaurs', 'Page 1', 'Desc', 'toddler');
  assert.ok(toddlerPrompt.includes('Very simple bold shapes'));
  assert.ok(toddlerPrompt.includes('toddler-friendly'));

  const olderPrompt = buildPagePrompt('space dinosaurs', 'Page 1', 'Desc', 'older');
  assert.ok(olderPrompt.includes('intricate background details'));
});

test('validateBookInput checks required fields and lengths', () => {
  assert.equal(validateBookInput('', 'space').isValid, false);
  assert.equal(validateBookInput('Leo', '').isValid, false);
  assert.equal(validateBookInput('   ', '   ').isValid, false);
  assert.equal(validateBookInput('Leo', 'Space Dinosaurs').isValid, true);
  
  const superLongName = 'A'.repeat(35);
  assert.equal(validateBookInput(superLongName, 'theme').isValid, false);
});

test('generateDemoBook outputs exactly 5 distinct pages with SVG art', () => {
  const book = generateDemoBook('Leo', 'Space Dinosaurs', '2K');
  assert.equal(book.childName, 'Leo');
  assert.equal(book.pages.length, 5);
  assert.equal(book.imageSize, '2K');

  // Verify all 5 pages have distinct titles and non-empty SVGs
  const titles = new Set(book.pages.map(p => p.title));
  assert.equal(titles.size, 5);

  book.pages.forEach((page, idx) => {
    assert.equal(page.pageNumber, idx + 1);
    assert.ok(page.imageUrl.startsWith('data:image/svg+xml'));
    assert.ok(page.rhymeCaption.length > 5);
  });
});

test('getVectorLineArtSvg generates valid SVG data URL', () => {
  const svgDataUrl = getVectorLineArtSvg(0, 'space', 'Leo');
  assert.ok(svgDataUrl.startsWith('data:image/svg+xml'));
  assert.ok(decodeURIComponent(svgDataUrl).includes('<svg'));
  assert.ok(decodeURIComponent(svgDataUrl).includes('Captain T-Rex'));
});
