/*
 * "Skeet Shooting": A retro-style skeet shooting game
 * Copyright (C) 2021  Salvatore Michele Rago
 *
 * This file is part of Skeet Shooting
 *
 * Nome-Programma is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nome-Programma is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Nome-Programma.  If not, see <http://www.gnu.org/licenses/>.
 */

kaboom({
    global: true,
    scale: 2,
    fullscreen: true,
    // width: 240,
    // height: 240,
    debug: true,
    // clearColor: [ 0, 0, 0, 1 ],
    clearColor: null,
});

// The coordinates of the position of the cannon in the background
const BACKGROUND_IM_WIDTH = 3800;
const BACKGROUND_IM_HEIGHT = 1900;

const BG_CANNON_X_OR = 314.2857;
const BG_CANNON_Y_OR = 713.277;
// const BG_CANNON_X_START_OR = 314.2857;
// const BG_CANNON_X_END_OR = 325.143;
// const BG_CANNON_Y_OR = 700.277;
// const BG_CANNON_HEIGHT_OR = BG_CANNON_X_END_OR - BG_CANNON_X_START_OR;

// const BG_CANNON_X_START = (BG_CANNON_X_START_OR * width()) / BACKGROUND_IM_WIDTH;
// const BG_CANNON_HEIGHT = (BG_CANNON_HEIGHT_OR * height()) / BACKGROUND_IM_HEIGHT;
const BG_CANNON_Y = (BG_CANNON_Y_OR * height()) / BACKGROUND_IM_HEIGHT;
const BG_CANNON_X = (BG_CANNON_X_OR * width()) / BACKGROUND_IM_WIDTH;

// The coordinates of the vector that describes the speed of the skeet
let skeetSpeedX = 220;
let skeetSpeedYMin = 15;
let skeetSpeedYMax = (85 * height()) / 176;
let skeetSpeddY;

randSeed(Date.now());

loadSprite("background", './sprites/background.png');
loadSprite('spone', './sprites/spone.png');
loadSprite('gun', './sprites/gun.png');
loadSprite('bullet', './sprites/bullet.png');
loadSprite('heart', './sprites/heart.png');
loadSprite('skeet', './sprites/skeet.png', {
    sliceX: 9,
    sliceY: 1,
    anims: {
        main: {
            from: 0,
            to: 8,
        }
    }
});

loadSound('explosion', './sounds/explosion.wav');
loadSound('hit', './sounds/hit.wav');

layers([
    'bg', // background
    'game', // the moving items
    'gun', // the layer containing only the gun
    'ui' // the score rectangle
], 'game');

// Calculate the angle (in rads), relative to the vertical axis, that the gun has to make
// in order to be aligned in the same direction of the given mousePos.
function calcGunRotAngle(mousePos) {
    //      h
    //    |---pointer
    // t  |  /
    //    | /  q
    //   gun
    // alpha = arcsin(h/q)

    var t = height() - mousePos.y;
    var h = mousePos.x;
    var q = Math.sqrt(Math.pow(t, 2) + Math.pow(h, 2));

    return Math.asin(h / q);
}

// Shoot the bullet from the gun to the given target
function shootBullet(target) {
    add([
        sprite('bullet', {
            width: width() / 80,
        }),
        // scale(0.1), // DEBUG
        origin('botleft'),
        pos(0, height()),
        solid(),
        layer('game'),
        'bullet',
        {
            targetX: target.x,
            targetY: target.y
        }
    ]);

    play('explosion');
}

// Shoot the skeet from the cannon in a random direction
function shootSkeet() {
    add([
        sprite('skeet', {
            width: width() / 20,
            frame: 0
        }),
        pos(BG_CANNON_X, BG_CANNON_Y),
        // scale(0.05), // DEBUG
        solid(),
        'skeet',
        layer('game')
    ]);

    // Choose a random point in the vertical axis (this will be used to describe
    // a random direction)
    skeetSpeddY = rand(skeetSpeedYMin, skeetSpeedYMax);
}

function main() {
    // Display the background
    add([
        sprite('background', {
            width: width(),
            height: height(),
        }),
        layer('bg'),
    ]);

    // Display the gun
    let gun = add([
        layer('gun'),
    ]);
    gun.on('draw', () => {
        console.log('angle: ' +0.9 - calcGunRotAngle(mousePos()));
        drawSprite('gun', {
            height: height() / 3,
            origin: 'botleft',
            pos: vec2(0, height()),
            rot: 0.9 - calcGunRotAngle(mousePos()),
        });
    });
    // Display the gun spone that replaces the mouse pointer
    let spone = add([layer('game')]);
    spone.on('draw', () => {
        drawSprite('spone', {
                width: width() / 30,
                origin: 'center',
                pos: mousePos(),
            }
        );
    });

    // Make the cannon shoot skeets
    action("skeet", (sk) => {
        if (paused) return;

        let numFrames = sk.numFrames();
        let speedVec = vec2(skeetSpeedX, -skeetSpeddY);
        if (sk.frame === numFrames - 1) {
            // The skeet explosion animation is over, then destroy the skeet and shoot another one
            destroy(sk);
            shootSkeet();
        } else {
            // The skeet is still flying, then move it in

            // Choose the right speed of the skeet based on whether the explosion started or not
            if (sk.frame === 0) {
                speedVec = speedVec.scale(0.5 + (0.05 * playerScore));
            } else {
                speedVec = speedVec.scale(0.2);
            }
            sk.move(speedVec);

            // Destroy the skeet when it is off the screen
            if (sk.pos.x >= width() || sk.pos.y <= 0) {
                // The skeet went off the screen, then decrease the lives number
                destroy(sk);
                playerNumLives--;

                if (playerNumLives <= 0) {
                    // Send game over scene
                    go('game_over', playerScore);
                } else {
                    shootSkeet();
                }
            }
        }
    });

    // Add the shot effect on mouse click
    mouseClick(() => {
        if(paused) return;
        var currMousePos = mousePos();
        // console.log('mousePos\nx: ', currMousePos.x, '\ny: ', currMousePos.y); // DEBUG
        shootBullet(currMousePos);
    });
    action("bullet", (bull) => {
        if (paused) return;

        var speedVec = vec2(bull.targetX, -(height() - bull.targetY)).scale(4);
        bull.move(speedVec);
        if (bull.pos.x >= width() || bull.pos.y <= 0) {
            destroy(bull);
        }
    });

    collides('bullet', 'skeet', (b, s) => {
        destroy(b);
        // Display explosion and (automatically) destroy skeet
        s.play('main');

        // Increase score
        playerScore++;

        play('hit');
    });

    buildUi();

    shootSkeet();
}

scene("main", main);
go("main");