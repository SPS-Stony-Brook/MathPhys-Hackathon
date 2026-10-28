class Button{
  int x1;
  int y1;
  int x2;
  int y2;
  int w;
  int h;
  color col;
  color hover;
  String text;
  boolean toggled;

  Button(int y, int w,int h, String str, color col, color hover){
    y1=y;
    y2=y+h;
    this.w=w;
    this.h=h;
    this.col=col;
    this.hover=hover;
    text=str;
    toggled = false;
  }

  Button(int x,int y,int w,int h,String str, color col, color hover){
    x1=x;
    y1=y;
    x2=x+w;
    y2=y+h;
    this.w=w;
    this.h=h;
    this.col=col;
    this.hover=hover;
    text=str;
    toggled = false;
  }

  void setX(int x){
   x1 = x;
   x2 = x+w;
  }
  
  void setStr(String str){
   text = str; 
  }

  void displayButton(){
      rectMode(CORNER);
      noStroke();
    if(mouseX>=x1&&mouseX<=x2&&mouseY>=y1&&mouseY<=y2){
      fill(hover);
    } else{
      fill(col);
    }
      rect(x1,y1,w,h);
      fill(255);
      textAlign(CENTER,CENTER);
      textSize(20);
      text(text,x1+w/2,y1+h/2);
  }
  
    void displayButtonAlt(){
      rectMode(CORNER);
      noStroke();
    if(toggled){
      fill(hover);
    } else{
      fill(col);
    }
      rect(x1,y1,w,h);
      fill(255);
      textAlign(LEFT,CENTER);
      textSize(20);
      text(text,x1+10,y1+h/2);
  }
  
  
  boolean clicked(){
    if(mouseX>=x1&&mouseX<=x2&&mouseY>=y1&&mouseY<=y2){
      toggled = !toggled;
      return true;
    }
    return false;
  }
}
