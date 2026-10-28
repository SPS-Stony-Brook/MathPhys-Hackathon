DataCore first;
Button adder;
JonesVector light;
int total;
int max;
int mode;
Button modeToggle;
PFont lora;
PFont courier;

void setup(){
 windowResizable(false);
 strokeCap(SQUARE);
 size(1500,550);
 background(0);
 adder = new Button(290-10,20,20, "+", 150, color(100,200,100));
 max = 5;
 total = 0;
 mode = 0;
 modeToggle = new Button(1500-155,20,145,40,"Mode: Ring", color(#802657), color(#c23281));
 lora = createFont("fonts/Lora-VariableFont_wght.ttf", 35);
 courier = createFont("fonts/CourierPrime-Regular.ttf",12);
 PImage icon = loadImage("bellowsicon.png");
  surface.setIcon(icon);
}

void draw(){
    
 background(0);   
 fill(color(#a11662));
 noStroke();
 rect(0,0,1500,80);
 textFont(lora,36);
 fill(255);
 textAlign(LEFT,CENTER);
 text("Ilmarinen", 30, 40);
 modeToggle.displayButtonAlt();
 
 fill(100);
 rect(0, 290-10, 50, 20);
 light = new JonesVector(1/sqrt(2),0,1/sqrt(2),0);
 light.display(50+(0.5)*((1400-total*100)/(total+1)), 290-70);
 light.displayIntensity(50+(0.5)*((1400-total*100)/(total+1)), 290-70);
 fill(255,0,0);
 rect(50,290-5,((1400-total*100)/(total+1)),10);
 adder.setX((int) (50-10+(0.5)*((1400-total*100)/(total+1))));
 if (total<max){
 adder.displayButton();
 }
 int counter = 0;
 DataCore viewer = first;
 while(viewer!=null){
 light = viewer.displayCore(mode,counter,total, max, light);
 counter++;
 viewer = viewer.getNext();
 }
 noStroke();
 if(light.intensity()<0.001f){
   fill(100);
 }else{
   fill(255*light.intensity()+100*(1-light.intensity()),100*(1-light.intensity()),100*(1-light.intensity()));
 }
 rect(1500-50,290-40,50,80);
}
void mouseClicked(){
  

  DataCore current = first;
  while (current!=null){
   current.processPressEvents();
   current = current.getNext();
  }
  
  if (modeToggle.clicked()){
   if (mode==1){
     mode = 0;
     modeToggle.setStr("Mode: Ring");
   }else if (mode == 0 ){
     mode = 1;
     modeToggle.setStr("Mode: Matrix");
   }
  }
  
  DataCore viewer = first;
  int counter = 0;
  if (adder.clicked()) {
    if (total == 0) {
      first = new DataCore(null, null); 
      total++;
    } else if (total < max) {
      DataCore oldFirst = first;
      first = new DataCore(null, oldFirst);
      oldFirst.setPrev(first);
      total++;
    }
  }else{
  while (viewer != null) {
    int output = viewer.clickedButton();
    
    if (output == 1) {
      if (total < max) {
        viewer.add(); 
        total++;
        break;
      }
    } 
    
    if (output == 2) {
      if (viewer == first) {
        first = viewer.getNext();
      }
      
      viewer.remove(); 
      total--;
      
      if (total <= 0) {
        first = null;
        total = 0;
      }
      break;
    }
    
    counter++;
    viewer = viewer.getNext();
  }

  }
}

void mouseReleased() {
  DataCore current = first;
  while (current != null) {
    current.processReleaseEvents();
    current = current.getNext();
  }
}
