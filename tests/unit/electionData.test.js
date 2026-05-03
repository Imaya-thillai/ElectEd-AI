/**
 * Unit Tests — Election Data
 * @module tests/unit/electionData.test
 */

'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { electionPhases, quizQuestions, glossary } = require('../../src/data/electionData');

describe('electionPhases', () => {
  it('should have at least 5 phases', () => {
    assert.ok(electionPhases.length >= 5, `Expected >= 5 phases, got ${electionPhases.length}`);
  });

  it('should have required fields for each phase', () => {
    for (const phase of electionPhases) {
      assert.ok(phase.id, 'Phase must have an id');
      assert.ok(phase.title, 'Phase must have a title');
      assert.ok(phase.icon, 'Phase must have an icon');
      assert.ok(phase.color, 'Phase must have a color');
      assert.ok(phase.summary, 'Phase must have a summary');
      assert.ok(Array.isArray(phase.steps), 'Phase must have steps array');
      assert.ok(phase.steps.length > 0, 'Phase must have at least one step');
    }
  });

  it('should have unique phase IDs', () => {
    const ids = electionPhases.map(p => p.id);
    const unique = new Set(ids);
    assert.equal(ids.length, unique.size, 'Phase IDs must be unique');
  });

  it('should have valid steps with title and description', () => {
    for (const phase of electionPhases) {
      for (const step of phase.steps) {
        assert.ok(step.title, 'Step must have a title');
        assert.ok(step.description, 'Step must have a description');
      }
    }
  });
});

describe('quizQuestions', () => {
  it('should have at least 5 questions', () => {
    assert.ok(quizQuestions.length >= 5);
  });

  it('should have valid structure for each question', () => {
    for (const q of quizQuestions) {
      assert.ok(q.id, 'Question must have an id');
      assert.ok(q.question, 'Question must have a question text');
      assert.ok(Array.isArray(q.options), 'Question must have options array');
      assert.equal(q.options.length, 4, 'Question must have 4 options');
      assert.ok(typeof q.correct === 'number', 'Correct must be a number');
      assert.ok(q.correct >= 0 && q.correct < 4, 'Correct must be 0-3');
      assert.ok(q.explanation, 'Question must have an explanation');
    }
  });

  it('should have unique question IDs', () => {
    const ids = quizQuestions.map(q => q.id);
    assert.equal(ids.length, new Set(ids).size);
  });
});

describe('glossary', () => {
  it('should have at least 10 terms', () => {
    assert.ok(glossary.length >= 10);
  });

  it('should have term and definition for each entry', () => {
    for (const g of glossary) {
      assert.ok(g.term, 'Entry must have a term');
      assert.ok(g.definition, 'Entry must have a definition');
    }
  });

  it('should be sorted alphabetically', () => {
    for (let i = 1; i < glossary.length; i++) {
      assert.ok(
        glossary[i].term.localeCompare(glossary[i - 1].term) >= 0,
        `Glossary should be sorted: ${glossary[i - 1].term} before ${glossary[i].term}`
      );
    }
  });
});
