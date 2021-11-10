function simpleCompass() {
    // Show the compass heading as a single character
    if (Math.constrain(input.compassHeading(), 315, 360) == input.compassHeading()) {
        basic.showString("N")
    } else if (Math.constrain(input.compassHeading(), 0, 44) == input.compassHeading()) {
        basic.showString("N")
    } else if (Math.constrain(input.compassHeading(), 45, 134) == input.compassHeading()) {
        basic.showString("E")
    } else if (Math.constrain(input.compassHeading(), 135, 224) == input.compassHeading()) {
        basic.showString("S")
    } else {
        basic.showString("W")
    }
}
function detailedCompass() {
    // Show the compass heading as a maximum of two characters
    if (Math.constrain(input.compassHeading(), 338, 360) == input.compassHeading()) {
        basic.showString("N")
    } else if (Math.constrain(input.compassHeading(), 0, 22) == input.compassHeading()) {
        basic.showString("N")
    } else if (Math.constrain(input.compassHeading(), 23, 67) == input.compassHeading()) {
        basic.showString("NE")
    } else if (Math.constrain(input.compassHeading(), 68, 112) == input.compassHeading()) {
        basic.showString("E")
    } else if (Math.constrain(input.compassHeading(), 113, 157) == input.compassHeading()) {
        basic.showString("SE")
    } else if (Math.constrain(input.compassHeading(), 158, 202) == input.compassHeading()) {
        basic.showString("S")
    } else if (Math.constrain(input.compassHeading(), 203, 247) == input.compassHeading()) {
        basic.showString("SW")
    } else if (Math.constrain(input.compassHeading(), 248, 292) == input.compassHeading()) {
        basic.showString("W")
    } else {
        basic.showString("NW")
    }
}
let distance = 0
let recievedMessage = 0
let sentHelp = 0
let askedForHelp = 0
let menu = 0
let timeFormat = 24
menu = 0
askedForHelp = 0
sentHelp = 0
recievedMessage = 0
radio.setGroup(33)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(false)
input.calibrateCompass()
if (timeFormat == 12) {
    timeanddate.setTime(8, 10, 0, timeanddate.MornNight.PM)
} else {
    timeanddate.set24HourTime(13, 30, 0)
}
loops.everyInterval(500, function () {
    if (recievedMessage == 0) {
        if (menu == 0) {
            //Proximity
            basic.clearScreen()
            if (distance != 0) {
                //Evens out the LEDS by "reversing" the distance
                if (distance <= 100) {
                    led.plotBarGraph(
                    101 - distance,
                    100
                    )
                } else if (distance > 100) {
                    led.plotBarGraph(
                    151 - distance,
                    150
                    )
                } else {
                    basic.showLeds(`
                        . . . . .
                        . . . . .
                        . . . . .
                        . . . . .
                        . . . . .
                        `)
                }
            }
        } else if (menu == 1) {
            //Time
            basic.clearScreen()
            if (timeFormat == 12) {
                basic.showString(timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
            } else {
                basic.showString(timeanddate.time(timeanddate.TimeFormat.HMM))
            }
        } else if (menu == 2) {
            //Temperature
            let tempFormat = 0
            basic.clearScreen()
            if (tempFormat == 0) {
                basic.showString("" + input.temperature() + "C")
            } else if (tempFormat == 1) {
                basic.showString("" + input.temperature() * 33.8 + "F")
            } else {
                basic.showString("" + input.temperature() + "C" + "+" + input.temperature() * 33.8 + "F")
            }
        } else if (menu == 3) {
            //Compass
            let compassFormat = 0
            basic.clearScreen()
            if (compassFormat == 0) {
                simpleCompass()
            } else if (compassFormat == 1) {
                detailedCompass()
            } else if (compassFormat == 2) {
                simpleCompass()
                basic.showString("(" + input.compassHeading() + ")")
            } else {
                detailedCompass()
                basic.showString("(" + input.compassHeading() + ")")
            }
        } else if (sentHelp == 0) {
            //Help
            askedForHelp = 1
            basic.clearScreen()
            basic.showString("HELP?")
        }
    }
})
basic.forever(function () {
    distance = sonar.ping(
    DigitalPin.P0,
    DigitalPin.P1,
    PingUnit.Centimeters
    )
})
input.onButtonPressed(Button.A, function () {
    //Menu
    if (menu <= 3) {
        menu += 1
    } else {
        menu = 0
    }
})
input.onButtonPressed(Button.B, function () {
    //Ask for help
    if (askedForHelp == 1) {
        sentHelp = 1
        radio.sendString("HELP")
        basic.showIcon(IconNames.Yes)
    }
})
radio.onReceivedString(function (receivedString) {
    if (receivedString == "HELP") {
        //Send HELP
        recievedMessage = 1
        basic.showString("HELP")
        recievedMessage = 0
    } else if (receivedString == "FALL") {
        //Alert that the person has fallen
        recievedMessage = 1
        basic.showString("FALL")
        recievedMessage = 0
    }
})
