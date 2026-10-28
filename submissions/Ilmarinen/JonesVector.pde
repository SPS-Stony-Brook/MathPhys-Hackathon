class JonesVector {
  Complex[] vector;
  
  JonesVector(float r1, float i1, float r2, float i2){
    vector = new Complex[2];
    vector[0] = new Complex(r1,i1);
    vector[1] = new Complex(r2,i2);
  }
  
  void mult(Complex[][] matrix){
    Complex temp = Complex.add(Complex.mult(vector[0],matrix[0][0]),Complex.mult(vector[1],matrix[0][1]));
    vector[1] = Complex.add(Complex.mult(vector[0],matrix[1][0]),Complex.mult(vector[1],matrix[1][1]));
    vector[0] = temp;
  }
  
  float intensity(){
    return (pow((float) vector[0].magnitude(), 2)+pow((float) vector[1].magnitude(), 2));
  }
  
  void displayIntensity(float x, float y){
    pushStyle();
    pushMatrix();
    textFont(courier, 11);
    textAlign(CENTER, CENTER);
    fill(255);
    String text = "Intensity: " + String.format("%1.2f",(this.intensity()*100)) + "%";
    float textW = textWidth(text);
    translate(x-textW/2,y);
    text(text,textW/2,y/2);
    popMatrix();
    popStyle();
  }
  
  
  void display(float x, float y) {
    pushStyle();
    pushMatrix();
    
    String topText = vector[0].toTrimString();
    String bottomText = vector[1].toTrimString();
    
    if (topText.contains("+ -")) topText = topText.replace("+ -", "- ");
    if (bottomText.contains("+ -")) bottomText = bottomText.replace("+ -", "- ");
    
    textFont(courier, 11);
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(255);
    strokeWeight(2);
    
    float padding = 15;
    float textW = max(textWidth(topText), textWidth(bottomText)) + padding;
    float boxH = 60;
    
    translate(x - textW / 2, y - boxH / 2);
    
    line(0, 0, 0, boxH);
    line(0, 0, 8, 0);
    line(0, boxH, 8, boxH);
    
    line(textW, 0, textW, boxH);
    line(textW, 0, textW - 8, 0);
    line(textW, boxH, textW - 8, boxH);
    
    text(topText, textW / 2, boxH * 0.25);
    text(bottomText, textW / 2, boxH * 0.75);
    
    popMatrix();
    popStyle();
}
}
