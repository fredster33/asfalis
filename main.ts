input.onButtonPressed(Button.A, function () {
    if (menu <= 3) {
        menu += 1
    } else {
        menu = 0
    }
})
let distance = 0
let menu = 0
let compassFormat = 0
menu = 0
let timeFormat = 24
let tempFormat = 0
let showHelpConfirmation = 0
let showedHelpInstructions = 0
let askedForHelp = 0
let radioChannel = 33
radio.setGroup(radioChannel)
if (timeFormat == 12) {
    timeanddate.setTime(5, 24, 0, timeanddate.MornNight.AM)
} else {
    timeanddate.set24HourTime(13, 30, 0)
}
loops.everyInterval(500, function () {
    if (menu == 0) {
        basic.clearScreen()
        // anita is a genius
        // ask anita if I forgot
        led.plotBarGraph(
        101 - distance,
        100
        )
    } else if (menu == 1) {
        basic.clearScreen()
        if (timeFormat == 12) {
            basic.showString(timeanddate.time(timeanddate.TimeFormat.HMMAMPM))
        } else {
            basic.showString(timeanddate.time(timeanddate.TimeFormat.HMM))
        }
    } else if (menu == 2) {
        basic.clearScreen()
        if (tempFormat == 0) {
            basic.showString("" + input.temperature() + "C")
        } else if (tempFormat == 1) {
            basic.showString("" + input.temperature() * 33.8 + "F")
        } else {
            basic.showString("" + input.temperature() + "C" + "+" + input.temperature() * 33.8 + "F")
        }
    } else if (menu == 3) {
        basic.clearScreen()
        basic.showString("N")
    } else {
        basic.clearScreen()
        if (showedHelpInstructions == 0) {
            basic.showString("HELP?")
        }
        showedHelpInstructions = 1
    }
})
basic.forever(function () {
    if (showedHelpInstructions == 1) {
        if (askedForHelp == 0) {
            if (input.buttonIsPressed(Button.B)) {
                askedForHelp = 1
                radio.sendString("HELP")
                basic.showIcon(IconNames.Yes)
            }
        }
    }
})
basic.forever(function () {
    distance = sonar.ping(
    DigitalPin.P0,
    DigitalPin.P2,
    PingUnit.Centimeters
    )
})
