#include "xht11.h"
#include "lcd128_32_io.h"

xht11 xht(13);
unsigned char dht[4] = {0, 0, 0, 0};
lcd lcd(21, 22);

void setup() {
  lcd.Init();
  lcd.Clear();
}

char string[10];

void loop() {
if (xht.receive(dht)) { //Returns true when checked correctly
}
lcd.Cursor(0,0); //Set display position
lcd.Display("Temper:");
lcd.Cursor(0,8);
lcd.DisplayNum(dht[2]);
lcd.Cursor(0,11);
lcd.Display("C");
lcd.Cursor(2,0);
lcd.Display("humid:");
lcd.Cursor(2,8);
lcd.DisplayNum(dht[0]);
lcd.Cursor(2,11);
lcd.Display("%");
delay(200);
}