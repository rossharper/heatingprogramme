'use strict';

const { assert } = require('chai');
const fs = require('fs');
const path = require('path');
var chai = require('chai');
const ProgrammeFileWriter = require('../ProgrammeFileWriter');
var expect = chai.expect; // we are using the "expect" style of Chai
var Programme = require('./../Programme');
var ProgrammeFileLoader = require('./../ProgrammeFileLoader');

const PATH = '.';
const FILE_NAME = 'programme.json';
const FILE_PATH = path.join(PATH, '/', FILE_NAME);

describe('ProgrammeFileWriter should', function() {

    beforeEach(() => {
        try {
            deleteFile();
        } catch (e) {
            if (e.code !== 'ENOENT') {
                assert.fail('error cleaning up test file');
            }
        }
    });

    afterEach(() => {
        try {
            deleteFile();
        } catch (e) {
            assert.fail('error cleaning up test file');
        }
    });

    function deleteFile() {
        fs.unlinkSync(FILE_PATH);
    }

    it('successfully write programme file', function(done) {
        ProgrammeFileLoader.loadProgramme(PATH, function(programme) {
            programme.setComfortSetPoint(30);
            programme.setHeatingOff();
            ProgrammeFileWriter.writeProgramme(PATH, programme, function() {
                ProgrammeFileLoader.loadProgramme(PATH, function(writtenProgramme) {
                    expect(programme.getComfortSetPoint()).to.equal(30);
                    expect(programme.isHeatingEnabled()).to.equal(false);
                    done();
                });
            });
        });
    });
  });
