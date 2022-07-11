from TicTacToe import TicTacToe 
from board import board
from player import player
class auto():
    def __init__(self):
        self.game=None
        self.player1=None
        self.player2=None
        self.board=None
    def start(self):
        s=''
        while True:
            self.game=TicTacToe()
            self.player1=player('X')
            self.player2=player('O')
            self.board=board()
            self.game.play(self.player1,self.player2,self.board)
            s=input('Do you want to exit("yes" or "no"): ')
            if(s=='no'):
                break

if __name__=='__main__':
    game=auto()
    game.start()