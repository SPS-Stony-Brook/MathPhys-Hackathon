class Slider {
  float x;
  float y;
  float w = 100;
  String label;
  
  float minVal;
  float maxVal;
  float step;
  float currentVal;
  boolean dragging = false;
  
  float[] snapValues;
  float snapThreshold; 

  Slider(float y, String label, float minVal, float maxVal, float step, float defaultVal) {    
    this.y = y;    
    this.label = label;    
    this.minVal = minVal;    
    this.maxVal = maxVal;    
    this.step = step;    
    this.currentVal = defaultVal;   
    
    if (minVal == 0 && maxVal == 360) {
      this.snapValues = new float[]{0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360};
      this.snapThreshold = 3.0;
    } else if (minVal == 0 && maxVal == 1) {
      this.snapValues = new float[]{0, 0.25, 0.50, 0.75, 1.0};
      this.snapThreshold = 0.02;
    } else {
      this.snapValues = new float[0];
      this.snapThreshold = 0;
    }
  }      
  
  void setX(float x){
   this.x = x; 
  }
  
  float getVal(){
    return currentVal;
  }
  
  void displaySlider(){
    stroke(180);
    strokeWeight(3);
    line(x,y,x+w,y);
    
    float handle = map(currentVal, minVal, maxVal, x, x+w);
    
    noStroke();
    if (dragging){
      fill(255,150,0);
    } else if  (mouseX >= handle - 8 && mouseX <= handle + 8 && mouseY >= y - 8 && mouseY <= y + 8) {
      fill(200);
    } else {
      fill(255);
    }
    ellipse(handle,y,10,10);
    fill(255);
    textSize(12);
    textAlign(LEFT,CENTER);
    text(label + ":", x, y- 15);
    
    if (step < 1.0) {
      text(nf(currentVal, 1, 2), x + w - 50, y - 15);
    } else {
      text(int(currentVal), x + w - 50, y - 15);
    }
  }
  
  void update(){
    if(dragging){
       float rawVal = map(mouseX, x, x+w, minVal, maxVal);
       rawVal = constrain(rawVal, minVal, maxVal);
      float stepsCount = round((rawVal-minVal)/step);        
      float normalVal = minVal + (stepsCount*step);     
      boolean snapped = false;
      for (float snapTarget : snapValues) {
        if (abs(rawVal - snapTarget) < snapThreshold) {
          currentVal = snapTarget;
          snapped = true;
          break;
        }
      }
      
      if (!snapped) {
        currentVal = normalVal;
      }
    }
  }
  
  void checkPressed(){
    float handle = map(currentVal, minVal, maxVal,x,x+w);
    if (mouseX>=handle-10 &&mouseX<=handle+10&&mouseY>=y-10&&mouseY<=y+10){
       dragging = true; 
    }
  }
  void release(){
    dragging = false;
  }
}
