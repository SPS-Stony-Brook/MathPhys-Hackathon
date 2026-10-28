public class Complex {
    private double real;
    private double imaginary;
    public Complex(double r, double i){
        real = r;
        imaginary = i;
    }
    public Complex(double p, double a, boolean c){
         real = p * Math.cos(Math.toRadians(a));
         imaginary = p * Math.sin(Math.toRadians(a));
    }
    public String toString(){
        return real + " + " + imaginary + "i";
    }
    
    public String toTrimString(){
        return String.format("%.4f", real) + " + " + String.format("%.4f", imaginary) + "i";
    }

    public double magnitude(){
        return Math.sqrt(Math.pow(real,2)+Math.pow(imaginary,2));
    }

    public double[] get(){
        return new double[]{real,imaginary};
    }

    public double get(int i){
        return get()[i];
    }

    public void set(double r, double i){
        real = r;
        imaginary = i;  
    }
    
    public void euler(double p, double a){
         real = p * Math.cos(Math.toRadians(a));
         imaginary = p * Math.sin(Math.toRadians(a));
    }
    
    
    public static Complex add(Complex c1, Complex c2){
        return new Complex(c1.get(0)+c2.get(0),c1.get(1)+c2.get(1));
    }

    public static Complex mult(Complex c1, Complex c2){
        return new Complex(c1.get(0)*c2.get(0)-c1.get(1)*c2.get(1),c1.get(1)*c2.get(0)+c1.get(0)*c2.get(1));
    }
    
    public static Complex mult(Complex c1, double f1){
       return new Complex(c1.get(0)*f1, c1.get(1)*f1);
    }
    
    public static Complex sub(Complex c1, Complex c2){
       return new Complex(c1.get(0)-c2.get(0),c1.get(1)-c2.get(1)); 
    }
}
