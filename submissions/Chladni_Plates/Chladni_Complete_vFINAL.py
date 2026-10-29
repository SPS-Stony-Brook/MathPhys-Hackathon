#Imports
import numpy as np
import pygame
import matplotlib.cm as cm


# pygame setup
pygame.init()
pygame.display.set_caption("Standing Waves and Chladni Plates")
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()
running = True
dt = 0

#Define Variables
nx = 3
ny = 5
A = 0.25
isShift = 1

ScreenNum = 0
cx = screen.get_width()
cy = screen.get_height()

surf = pygame.Surface((700, 700))
x = np.linspace(-350, 350, 700)
y = np.linspace(-350, 350, 700)
X, Y = np.meshgrid(x, y)

pause = False
time = 0
timetick = 1
counter = 0

Amp =2
gridlines = np.linspace(-350,300,14) + cx/2
source = np.linspace(-350, 350,7001)
reflected = np.linspace(-350, 350,7001)
standing = np.linspace(-350, 350,7001)



Lines = [[(cx/2-350, 4*cy/5),(cx/2+350, 4*cy/5),4],
         [(cx/2-350, 3*cy/5), (cx/2+350, 3*cy/5),4],
         [(cx/2-350, cy/4),(cx/2+350, cy/4),4],
         [(cx/2-352,cy-20),(cx/2-352,cy-680),4]
         ]
for i in range(len(gridlines)):
        Lines.append([(gridlines[i],4*cy/5-10),(gridlines[i],4*cy/5+10),1])
        Lines.append([(gridlines[i],3*cy/5-10),(gridlines[i],3*cy/5+10),1])
        Lines.append([(gridlines[i],cy/4-15),(gridlines[i],cy/4+15),1])


#functions

def chladniAmp(x,y,L=350):
    return np.cos(nx*np.pi*x/L)*np.cos(ny*np.pi*y/L)+np.cos(ny*np.pi*x/L)*np.cos(nx*np.pi*y/L)

def mouseClose(x,y,radius=10):
    return event.type == pygame.MOUSEBUTTONDOWN and pygame.Vector2(pygame.mouse.get_pos()).distance_to(pygame.Vector2(x,y))<radius
def write(text,location,color=(255,255,255),size=20):
    font = pygame.font.Font(None, size)
    screen.blit(font.render(text,True,color),location)

#Define 1D Wave Functions
def ReflectedWave(f,x,t,Amp):
    return -15 * Amp * np.sin(0.08*t+ f/100*( - x - 700))
def SourceWave(f,x,t,Amp):
    return 15*Amp*np.sin(f/100*(x)+0.08*t)
def StandingWave(f,x,t,Amp):
    return SourceWave(f,x,t,Amp) + ReflectedWave(f,x,t,Amp)

while running:
    # poll for events
    # pygame.QUIT event means the user clicked X to close your window
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # fill the screen with a color to wipe away anything from last frame
    screen.fill("black")

    #Title screen

    if ScreenNum == 0:
        pygame.draw.rect(screen, (255,255,255), pygame.Rect(cx/3-110,cy/2+90,245,50),3)
        write("Chladni Plate",(cx/3-100,cy/2+100),(255,255,255),50)
        if mouseClose(cx/3,cy/2+100,200):
            A = 0.25
            ScreenNum = 1
            sand = np.random.uniform(-350, 350, size=(10000, 2))
        pygame.draw.rect(screen, (255,255,255), pygame.Rect(2*cx/3-210,cy/2+90,425,50),3)
        write("Standing Wave Gradient",(2*cx/3-200,cy/2+100),(255,255,255),50)
        if mouseClose(2*cx/3,cy/2+100,200):
            ScreenNum = 2
        pygame.draw.rect(screen, (255, 255, 255), pygame.Rect(cx / 2 - 160, cy / 2 -110, 320, 50), 3)
        write("1D Standing Wave", (cx / 2 - 150, cy / 2 - 100), (255, 255, 255), 50)
        if mouseClose(cx/2,cy/2 - 100,150):
            ScreenNum = 3
            f = 5

    if ScreenNum in (1,2):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_SPACE]:
            isShift = 10
        else:
            isShift = 1
        if keys[pygame.K_w] or mouseClose(1135,679):
            nx += dt*isShift
        if keys[pygame.K_s] or mouseClose(1087,679):
            nx -= dt*isShift
        if keys[pygame.K_d] or mouseClose(1135,630):
            ny += dt*isShift
        if keys[pygame.K_a] or mouseClose(1087,630):
            ny -= dt*isShift
        if mouseClose(cx-200,cy-550,50):
            ScreenNum = 0

        nx = np.clip(nx, 0, 10)
        ny = np.clip(ny, 0, 10)
        A = np.clip(A, 0, 3)
        write("    n     =  "+str(np.trunc(nx*100)/100),(cx-200,cy-50),(255,255,255),30)
        pygame.draw.polygon(screen,(255,255,255),((cx-205+25-5,cy-52+20),(cx-205-5+25,cy-52),(cx-205,cy-52+10)))
        pygame.draw.polygon(screen, (255, 255, 255),
                            ((cx - 205 + 25+20, cy - 52 + 20), (cx - 205 + 25+20, cy - 52), (cx - 205+20+45, cy - 52 + 10)))
        write("   m      =  " + str(np.trunc(ny*100)/100), (cx - 200, cy - 100), (255, 255, 255),30)
        pygame.draw.polygon(screen, (255, 255, 255),
                            ((cx - 205 + 25 - 5, cy - 52 + 20-50), (cx - 205 - 5 + 25, cy - 52-50), (cx - 205, cy - 52 + 10-50)))
        pygame.draw.polygon(screen, (255, 255, 255),
                            ((cx - 205 + 25 + 20, cy - 52 + 20-50), (cx - 205 + 25 + 20, cy - 52-50),
                             (cx - 205 + 20 + 45, cy - 52 + 10-50)))
        write("Reset",(cx-200,cy-350),(255,255,255))
        pygame.draw.rect(screen, (255, 255, 255), pygame.Rect(cx - 210, cy - 360, 55, 30), 3)
        write("Back",(cx-200,cy-550),(255,255,255))
        pygame.draw.rect(screen, (255, 255, 255), pygame.Rect(cx - 210, cy - 560, 50, 30), 3)

        write("w/s = +/- m", (10, cy / 2 - 200), (255, 255, 255), 27)
        write("d/a = +/- n", (10, cy / 2 - 175), (255, 255, 255), 27)
        write("up/down = +/- A", (10, cy / 2 - 150), (255, 255, 255), 27)
        write("or use the arrows", (10, cy / 2 - 125), (255, 255, 255), 27)
        write("m and n are the", (10, cy / 2), (255, 255, 255), 27)
        write("vibrational modes.", (10, cy / 2+25), (255, 255, 255), 27)
        write("They are dependant on the", (10, cy / 2 + 50), (255, 255, 255), 27)
        write("physical properties of the plate", (8, cy / 2 + 75), (255, 255, 255), 27)
        write("and the frequency of the wave.", (10, cy / 2 + 100), (255, 255, 255), 27)
        write("In this simulation, you can", (10, cy / 2 + 150), (255, 255, 255), 27)
        write("you can change the modes", (10, cy / 2 + 175), (255, 255, 255), 27)
        write("directly.", (10, cy / 2 + 200), (255, 255, 255), 27)
        write("m and n are interchangeable.", (10, cy / 2 + 250), (255, 255, 255), 27)

        # draw the border rectangles
        pygame.draw.rect(screen, (0,200,200), (cx//2-360, cy//2-360, 720, 720), width=10)
            

    if ScreenNum == 1:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_UP] or mouseClose(1135,579):
            A += 0.2*dt*isShift
        if keys[pygame.K_DOWN] or mouseClose(1087,579):
            A -= 0.2 * dt*isShift
        if keys[pygame.K_r] or mouseClose(1100,380,20):
            sand = np.random.uniform(-350, 350, size=(10000, 2))
            A = 0.25

        write("    A      =  " + str(np.trunc(A * 100) / 100), (cx - 200, cy - 150),
              (255, 255, 255),30)
        pygame.draw.polygon(screen, (255, 255, 255),
                            ((cx - 205 + 25 - 5, cy - 52 + 20 - 100), (cx - 205 - 5 + 25, cy - 52 - 100),
                             (cx - 205, cy - 52 + 10 -100)))
        pygame.draw.polygon(screen, (255, 255, 255),
                            ((cx - 205 + 25 + 20, cy - 52 + 20 - 100), (cx - 205 + 25 + 20, cy - 52 - 100),
                             (cx - 205 + 20 + 45, cy - 52 + 10 - 100)))

        sand = np.asarray(sand)
        angle = np.random.random(len(sand)) * 2 * np.pi
        unit_vectors = np.column_stack((np.cos(angle), np.sin(angle)))
        magnitudes = chladniAmp(sand[:, 0], sand[:, 1])**2* 6 * A
        sand += unit_vectors * magnitudes[:, np.newaxis]
        sand = np.clip(sand, -350, 350)

        coords = (sand + [cx//2, cy//2]).astype(int)
        pixels = pygame.surfarray.pixels3d(screen)
        pixels[coords[:, 0], coords[:, 1]] = (255, 255, 255)

        del pixels

    elif ScreenNum == 2:
        keys = pygame.key.get_pressed()
        if keys[pygame.K_r] or mouseClose(1100,380,20):
            nx = 3
            ny = 5
        # Map function output to viridis, turn to rgb
        values = np.abs(chladniAmp(X, Y)) / 2
        rgb = (cm.viridis(values)[..., :3] * 255).astype(np.uint8)

        # Draw the color map onto the screen
        pygame.surfarray.blit_array(surf, rgb.swapaxes(0, 1))
        screen.blit(surf, (cx//2 - 350, cy//2 - 350))


    elif ScreenNum == 3:
        time += timetick
        keys = pygame.key.get_pressed()
        isShift = 1
        if keys[pygame.K_d] or mouseClose(1135,630):
            f += dt*5*isShift
        if keys[pygame.K_a] or mouseClose(1087,630):
            f -= dt*5*isShift
        if keys[pygame.K_w] or mouseClose(1135,579):
            Amp += dt*isShift
        if keys[pygame.K_s] or mouseClose(1087,579):
            Amp -= dt*isShift
        if  keys[pygame.K_SPACE]:
            counter = True
        if not keys[pygame.K_SPACE]:
            if counter:
                counter = False
                pause = not pause


        if mouseClose(cx - 200, cy - 550, 50):
            ScreenNum = 0
        write("Back", (cx - 200, cy - 550), (255, 255, 255))
        pygame.draw.rect(screen, (255, 255, 255), pygame.Rect(cx - 210, cy - 560, 50, 30), 3)

        f = np.clip(f,2,8)
        Amp = np.clip(Amp, 0.5, 3.5)

        if pause:
            timetick = 0
        else:
            timetick  = 1

        for line in Lines:
            pygame.draw.line(screen, (255, 255, 255), line[0], line[1], line[2])

        write("w/s = +/- f", (cx/2 +400, cy / 2 ), (255, 255, 255), 27)
        write("d/a = +/- A", (cx/2 +400, cy / 2 - 25), (255, 255, 255), 27)
        write("space = play/pause", (cx/2 +400, cy / 2 - 50), (255, 255, 255), 27)
        write("Incoming Wave",(cx/2-600,4*cy/5-15),(255,255,255),40)
        write("Reflected Wave",(cx/2-600,3*cy/5-25),(255,255,255),40)
        write("(Phase Shift by π)",(cx/2-600,3*cy/5),(255,255,255),30)
        write("Standing Wave",(cx/2-600,cy/4-30),(255,255,255),40)
        write("(Sum of Waves)",(cx/2-600,cy/4),(255,255,255),30)

        write("    A      =  " + str(np.trunc(Amp * 100) / 100), (cx - 200, cy - 150),
              (255, 255, 255),30)
        pygame.draw.polygon(screen, (255, 255, 255),
                            ((cx - 205 + 25 - 5, cy - 52 + 20 - 100), (cx - 205 - 5 + 25, cy - 52 - 100),
                             (cx - 205, cy - 52 + 10 -100)))
        pygame.draw.polygon(screen, (255, 255, 255),
                            ((cx - 205 + 25 + 20, cy - 52 + 20 - 100), (cx - 205 + 25 + 20, cy - 52 - 100),
                             (cx - 205 + 20 + 45, cy - 52 + 10 - 100)))
        write("    f      =  " + str(np.trunc(f*100)/100), (cx - 200, cy - 100), (255, 255, 255),30)
        pygame.draw.polygon(screen, (255, 255, 255),
                            ((cx - 205 + 25 - 5, cy - 52 + 20-50), (cx - 205 - 5 + 25, cy - 52-50), (cx - 205, cy - 52 + 10-50)))
        pygame.draw.polygon(screen, (255, 255, 255),
                            ((cx - 205 + 25 + 20, cy - 52 + 20-50), (cx - 205 + 25 + 20, cy - 52-50),
                             (cx - 205 + 20 + 45, cy - 52 + 10-50)))



        source_wave = np.stack([source,SourceWave(f,source,time,Amp)], axis = 1) + [[cx/2, 4*cy/5]]
        reflected_wave = np.stack([reflected,ReflectedWave(f,reflected,time,Amp)], axis = 1) + [[cx/2, 3*cy/5]]
        standing_wave = np.stack([standing,StandingWave(f,standing,time,Amp)], axis = 1) + [[cx/2, cy/4]]
        coords = (np.concatenate((source_wave, reflected_wave, standing_wave))).astype(int)
        pixels = pygame.surfarray.pixels3d(screen)
        pixels[coords[:, 0], coords[:, 1]] = (0, 128, 255)
        pixels[coords[:, 0], coords[:, 1]+1] = (0, 128, 255)
        pixels[coords[:, 0], coords[:, 1]-1] = (0, 128, 255)

        del pixels


            

    pygame.display.flip()


    # limits FPS to 60
    # dt is delta time in seconds since last frame, used for framerate-
    # independent physics.
    dt = clock.tick(60) / 1000

pygame.quit()