class DataCore{
 float p1;
 float p2;
 int phi1;
 int phi2;
 int theta;
 Complex[][] matrix;
 DataCore next;
 DataCore prev;
 Button remover;
 Button adder;
 Slider sp1,sphi1,sp2,sphi2,stheta;
 DataCore(DataCore prev, DataCore next){
   p1 = 1;
   phi1 = 0;
   p2 = 0;
   phi2 = 0;
   theta = 0;
   this.next = next;
   this.prev = prev;
   matrix = new Complex[2][2];
   matrix[0][0] = new Complex(1,0);
   matrix[0][1] = new Complex(0,0);
   matrix[1][0] = new Complex(0,0);
   matrix[1][1] = new Complex(0,0);
   adder = new Button(290-10,20,20, "+", 150, color(100,200,100));
   remover = new Button(290-150,80,20, "Remove", 150, color(225,50,50));
   sp1 = new Slider(290+50+30,"p_1", 0, 1, 0.01, p1);
   sp2 = new Slider(290+50+60,"p_2", 0, 1, 0.01, p2);
   sphi1 = new Slider(290+50+90,"phi_1", 0, 360, 1, phi1);
   sphi2 = new Slider(290+50+120,"phi_2", 0, 360, 1, phi2);
   stheta = new Slider(290+50+150,"theta", 0, 360, 1, theta);
 }
 
 void setNext(DataCore next){
  this.next = next; 
 }
 
 void setPrev(DataCore prev){
  this.prev = prev; 
 }
 
 DataCore getNext(){
  return next; 
 }
 
 DataCore getPrev(){
   return prev;
 }
 
 JonesVector displayCore(int mode, int position, int total, int max, JonesVector vector){
   noStroke();
   fill(100);
   rectMode(CORNER);
   //rect(50+(position)*100+(position+1)*((1400-total*100)/(total+1)),290-150,100,300);
   sp1.setX(50+(position)*100+(position+1)*((1400-total*100)/(total+1)));
   sp2.setX(50+(position)*100+(position+1)*((1400-total*100)/(total+1)));
   sphi1.setX(50+(position)*100+(position+1)*((1400-total*100)/(total+1)));
   sphi2.setX(50+(position)*100+(position+1)*((1400-total*100)/(total+1)));
   stheta.setX(50+(position)*100+(position+1)*((1400-total*100)/(total+1)));
   
   sp1.update();
   sp1.displaySlider();
   sp2.update();
   sp2.displaySlider();
   sphi1.update();
   sphi1.displaySlider();
   sphi2.update();
   sphi2.displaySlider();
   stheta.update();
   stheta.displaySlider();
   
   p1 = sp1.getVal();
   phi1 = (int) sphi1.getVal();
   p2 = sp2.getVal();
   phi2 = (int) sphi2.getVal();
   theta = (int) stheta.getVal();
   this.matrixUpdate();
   vector.mult(matrix);
   vector.display(50+(position+1)*100+(position+1.5)*((1400-total*100)/(total+1)), 290-70);
   vector.displayIntensity(50+(position+1)*100+(position+1.5)*((1400-total*100)/(total+1)), 290-70);
   fill(255*vector.intensity(),0,0);
   rect(50+(position+1)*100+(position+1)*((1400-total*100)/(total+1)),290-5,((1400-total*100)/(total+1)),10);
   adder.setX((int) (50-10+(position+1)*100+(position+1.5)*((1400-total*100)/(total+1))));
   remover.setX((int) (50+10+(position)*100+(position+1)*((1400-total*100)/(total+1))));
   if (total<max){
   adder.displayButton();
   }
   remover.displayButton();
   

   
   if(mode == 0){
     noFill();          
     stroke(255);    
     strokeCap(ROUND);
     strokeWeight(7);
     ellipse(50+(position)*100+(position+1)*((1400-total*100)/(total+1))+50, 290, 100,100);
     line(50+(position)*100+(position+1)*((1400-total*100)/(total+1))+50, 290,50+(position)*100+(position+1)*((1400-total*100)/(total+1))+50+47*cos(radians(theta)), 290-47*sin(radians(theta)));
     strokeCap(SQUARE);
 } else if (mode == 1){
     this.displayMatrix(50+(position)*100+(position+1)*((1400-total*100)/(total+1)), 290-50, matrix);
   }
   return vector;
}

int clickedButton(){
 if(adder.clicked()){
   return 1;
 }
 if(remover.clicked()){
   return 2;
 }
 return 0;
}

void add(){
  if (this.getNext()!=null){
  this.getNext().setPrev(new DataCore(this, this.getNext()));
  this.setNext(this.getNext().getPrev());
  }else{
   this.setNext(new DataCore(this, null)); 
  }
}
DataCore remove() {
  DataCore nextNode = this.next;
  DataCore prevNode = this.prev;
  
  if (prevNode != null) {
    prevNode.setNext(nextNode);
  }
  if (nextNode != null) {
    nextNode.setPrev(prevNode);
  }
  
  this.next = null;
  this.prev = null;
  
  return nextNode; 
}



  void processPressEvents() {
    sp1.checkPressed();
    sphi1.checkPressed();
    sp2.checkPressed();
    sphi2.checkPressed();
    stheta.checkPressed();
  }

  void processReleaseEvents() {
    sp1.release();
    sphi1.release();
    sp2.release();
    sphi2.release();
    stheta.release();
  }

  void matrixUpdate(){
    double cos2 = cos(2*radians(theta));
    double sin2 = sin(2*radians(theta));
    
    matrix[0][0]=Complex.mult(Complex.add(Complex.add(new Complex(p1,phi1,true),new Complex(p2,phi2,true)),Complex.mult(Complex.sub(new Complex(p1,phi1,true),new Complex(p2,phi2,true)),cos2)),0.5);
    matrix[0][1]=Complex.mult(Complex.mult(Complex.sub(new Complex(p1,phi1,true),new Complex(p2,phi2,true)),sin2),0.5);
    matrix[1][0]=Complex.mult(Complex.mult(Complex.sub(new Complex(p1,phi1,true),new Complex(p2,phi2,true)),sin2),0.5);
    matrix[1][1]=Complex.mult(Complex.sub(Complex.add(new Complex(p1,phi1,true),new Complex(p2,phi2,true)),Complex.mult(Complex.sub(new Complex(p1,phi1,true),new Complex(p2,phi2,true)),cos2)),0.5);
  }

void displayMatrix(float x, float y, Complex[][] mat) {

  pushStyle();
  pushMatrix();
  translate(x, y);
  double m00_img = mat[0][0].get(1);
  double m01_img = mat[0][1].get(1);
  double m10_img = mat[1][0].get(1);
  double m11_img = mat[1][1].get(1);

  String m00_r = String.format("%1.4f", mat[0][0].get(0));
  String m01_r = String.format("%1.4f", mat[0][1].get(0));
  String m10_r = String.format("%1.4f", mat[1][0].get(0));
  String m11_r = String.format("%1.4f", mat[1][1].get(0));
  
  String m00_i = String.format("%1.4f", Math.abs(m00_img)) + "i";
  String m01_i = String.format("%1.4f", Math.abs(m01_img)) + "i";
  String m10_i = String.format("%1.4f", Math.abs(m10_img)) + "i";
  String m11_i = String.format("%1.4f", Math.abs(m11_img)) + "i";

  String s00 = m00_img >= 0 ? "+" : "-";
  String s01 = m01_img >= 0 ? "+" : "-";
  String s10 = m10_img >= 0 ? "+" : "-";
  String s11 = m11_img >= 0 ? "+" : "-";

  textFont(courier, 9.5);
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(255);
  strokeWeight(2);

  float boxW = 100;
  float boxH = 100;
  float capSize = 10;

  line(0, 0, 0, boxH);
  line(0, 0, capSize, 0);
  line(0, boxH, capSize, boxH);
  line(boxW, 0, boxW, boxH);
  line(boxW, 0, boxW - capSize, 0);
  line(boxW, boxH, boxW - capSize, boxH);

  float col1X = boxW * 0.25f;
  float col2X = boxW * 0.75f;
  float row1TopY = boxH * 0.17f;
  float row1BotY = boxH * 0.33f;
  float row2TopY = boxH * 0.67f;
  float row2BotY = boxH * 0.83f;

  text(m00_r, col1X, row1TopY);
  text(s00 + m00_i, col1X, row1BotY);
  
  text(m01_r, col2X, row1TopY);
  text(s01 + m01_i, col2X, row1BotY);
  
  text(m10_r, col1X, row2TopY);
  text(s10 + m10_i, col1X, row2BotY);
  
  text(m11_r, col2X, row2TopY);
  text(s11 + m11_i, col2X, row2BotY);

  popMatrix();
  popStyle();
}


}
