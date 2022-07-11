import unittest2
import unittest.mock as mock
import io
import sys
sys.path.append('..')
import src.auto as auto

class TestTicTacToe(unittest2.TestCase):
    def test_isValid(self):
        game=TicTacToe()
        with self.subTest():
            self.assertEqual(game.isValid('asf,kljsf,sf'),False)
        with self.subTest():
            self.assertEqual(game.isValid('fs,2'),False)
        with self.subTest():
            self.assertEqual(game.isValid('2,daf'),False)
        with self.subTest():
            self.assertEqual(game.isValid('2 ,2'),False)
        with self.subTest():
            self.assertEqual(game.isValid('10,0'),False)
        with self.subTest():
            self.assertEqual(game.isValid('-2,2'),False)
        with self.subTest():
            self.assertEqual(game.isValid('2,-1'),False)
        with self.subTest():
            self.assertEqual(game.isValid('0,29'),False)
        game.state[0][0]='X'
        with self.subTest():
            self.assertEqual(game.isValid('0,0'),False)
        with self.subTest():
            self.assertEqual(game.isValid('0,2'),True)
    
    def test_getinput(self):
        game=TicTacToe()
        p=player
        p.move=mock.Mock()
        p.move.side_effect=['asdf','af,2','2,4','0,0','1,2']
        game.state=[['X','',''],['','',''],['','','']]
        OutputCapture=io.StringIO()
        sys.stdout = OutputCapture
        self.assertEqual(game.getinput(p),[1,2])
        sys.stdout = sys.__stdout__
        s=''
        for i in range(4):
            s+='please input a valid format\n'
        self.assertEqual(OutputCapture.getvalue(),s)
    
    def test_checkRow(self):
        game=TicTacToe()
        game.state=[['X','X','X'],['O','O','O'],['','X','O']]
        with self.subTest():
            self.assertEqual(game.checkRow(0,game.state,'X'),True)
        with self.subTest():
            self.assertEqual(game.checkRow(1,game.state,'O'),True)
        with self.subTest():
            self.assertEqual(game.checkRow(2,game.state,'X'),False)
    
    def test_checkColumn(self):
        game=TicTacToe()
        game.state=[['X','O','X'],['X','O','O'],['X','O','']]
        with self.subTest():
            self.assertEqual(game.checkColumn(0,game.state,'X'),True)
        with self.subTest():
            self.assertEqual(game.checkColumn(1,game.state,'O'),True)
        with self.subTest():
            self.assertEqual(game.checkColumn(2,game.state,'X'),False)
    
    def test_checkDiag(self):
        game=TicTacToe()
        with self.subTest():
            self.assertEqual(game.checkDiag([1,0],game.state,'X'),False)
        with self.subTest():
            game.state=[['X','',''],['','X',''],['','','']]
            self.assertEqual(game.checkDiag([0,0],game.state,'X'),False)
        with self.subTest():
            game.state=[['X','',''],['','X',''],['','','X']]
            self.assertEqual(game.checkDiag([0,0],game.state,'X'),True)
        with self.subTest():
            game.state=[['X','','X'],['','X',''],['','','']]
            self.assertEqual(game.checkDiag([0,2],game.state,'X'),False)
        with self.subTest():
            game.state=[['X','','X'],['','X',''],['X','','X']]
            self.assertEqual(game.checkDiag([0,2],game.state,'X'),True)
        with self.subTest():
            game.state=[['','',''],['','X',''],['','','X']]
            self.assertEqual(game.checkDiag([1,1],game.state,'X'),False)
        with self.subTest():
            game.state=[['X','',''],['','X',''],['','','X']]
            self.assertEqual(game.checkDiag([1,1],game.state,'X'),True)
        with self.subTest():
            game.state=[['','','X'],['','X',''],['X','','X']]
            self.assertEqual(game.checkDiag([1,1],game.state,'X'),True)

    def test_winnable(self):
        game=TicTacToe()
        game.state=[['X','',''],['','X',''],['','','X']]
        with self.subTest():
            self.assertEqual(game.winnable('X',[2,2],game.state),True)
        with self.subTest():
            game.state[2][2]=''
            self.assertEqual(game.winnable('X',[2,2],game.state),False)
    
    def test_getUpdate(self):
        p=player('X')
        game=TicTacToe()
        p.value=mock.PropertyMock(return_value='X')
        game.winnable=mock.Mock(return_value=True)
        game.getUpdate([0,0],p)
        with self.subTest():
            self.assertEqual(game.won,True)
        with self.subTest():
            self.assertEqual(game.winner,p.value)
    
    def test_noMoves(self):
        game=TicTacToe()
        state=[['X','X','X'],['X','X','X'],['X','X','X']]
        with self.subTest():
            self.assertEqual(game.noMoves(state),True)
        with self.subTest():
            state[1][1]=''
            self.assertEqual(game.noMoves(state),False)
    
    def test_play(self):
        with self.subTest():
            game=TicTacToe()
            game.won=mock.PropertyMock(return_value=True)
            type(game).winner=mock.PropertyMock(return_value='X')
            OutputCapture=io.StringIO()
            sys.stdout = OutputCapture
            game.play({},{},{})
            sys.stdout = sys.__stdout__
            s='X won!\n'
            self.assertEqual(OutputCapture.getvalue(),s)
        
        with self.subTest():
            game=TicTacToe()
            game.noMoves=mock.Mock(return_value=True)
            OutputCapture=io.StringIO()
            sys.stdout = OutputCapture
            game.play({},{},{})
            sys.stdout = sys.__stdout__
            s='None won!\n'
            self.assertEqual(OutputCapture.getvalue(),s)
        


unittest2.main()