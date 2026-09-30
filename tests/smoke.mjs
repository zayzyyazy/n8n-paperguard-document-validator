import assert from 'node:assert/strict';
import {load, readExample, verifyExample} from './harness.mjs';
const run=load('paperguard');
let data=readExample('input');
for (const name of ['Normalize Document Structure','Resolve Effective Formatting','Load University Policy','Validate Formatting Rules','Validate Required Sections','Validate Citations & References','Validate Margins','Validate Heading Hierarchy','Validate Figures','Validate Long Quotations','Build PAPERGUARD Report']) {
  data=(await run(name,data))[0].json;
}
assert.equal(data.overallStatus,'FAIL');
assert.equal(data.policies.length,18);
assert.equal(data.policies.find(p=>p.policy_id==='POL-003').status,'FAIL');
assert.equal(data.policies.find(p=>p.policy_id==='POL-007').status,'FAIL');
assert.equal(data.policies.find(p=>p.policy_id==='POL-008').status,'FAIL');
verifyExample('output',data);
const base=(await run('Load University Policy',{paragraphs:[]}))[0].json;
const skipped=(await run('Validate Citations & References',base))[0].json;
assert.equal(skipped.validation.citations.status,'SKIPPED');
const absentMargins=(await run('Validate Margins',base))[0].json;
assert.equal(absentMargins.validation.margins.status,'FAIL');
const headings=(await run('Validate Heading Hierarchy',{...base,paragraphs:[{index:0,style:'Heading1',text:'Introduction'},{index:1,style:'Heading3',text:'Detail'}]}))[0].json;
assert.equal(headings.validation.headings.status,'FAIL');
const missingAbstract=(await run('Validate Required Sections',base))[0].json;
assert.equal(missingAbstract.validation.structure.checks.find(p=>p.policy_id==='POL-003').checked,false);
const report=(await run('Build PAPERGUARD Report',missingAbstract))[0].json;
assert.equal(report.policies.find(p=>p.policy_id==='POL-003').status,'FAIL'); // Preserved aggregation limitation.
const unchecked=(await run('Build PAPERGUARD Report',base))[0].json;
assert.equal(unchecked.overallStatus,'REVIEW_REQUIRED');
console.log('PASS: PAPERGUARD synthetic XML pipeline, required sections, missing references/margins, heading hierarchy, and unchecked-report checks; fixture matches.');
