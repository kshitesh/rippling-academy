class TicTacToe():
    def __init__(self):
        self.won=False
        self.winner=None
        self.state=[['','',''],['','',''],['','','']]

    def isValid(self,s):
        if(len(s.split(','))!=2):
            return False
        if(not s.split(',')[0].isdigit() or not s.split(',')[1].isdigit()):
            return False
        [row,column]=s.split(',')
        row=int(row)
        column=int(column)
        if row<0 or row>2 or column<0 or column>2:
            return False
        if(self.state[row][column]!=''):
            return False
        return True
    
    def getinput(self,p):
        s=p.move()
        while(not self.isValid(s)):
            print('please input a valid format')
            s=p.move()
        [row,column]=s.split(',')
        return [int(row),int(column)]
    
    def checkRow(self,row,state,value):
        for i in range(3):
            if state[row][i]!=value:
                return False
        return True
    
    def checkColumn(self,column,state,value):
        for i in range(3):
            if state[i][column]!=value:
                return False
        return True
    
    def checkDiag(self,arr,state,value):
        if(arr[0]!=arr[1] and (arr[0]+arr[1])!=2):
            return False
        check=True
        if(arr[0]==arr[1]):
            for i in range(3):
                if state[i][i]!=value:
                    if arr[0]==1:
                        check=False
                    else:
                        return False
            if arr[0]!=1:
                return True
            if check==True and arr[0]==1:
                return True
        check=True
        if((arr[0]+arr[1])==2):
            for i in range(3):
                if state[i][2-i]!=value:
                    if arr[0]==1:
                        check=False
                    else:
                        return False
            if arr[0]!=1:
                return True
            if check==True and arr[0]==1:
                return True
        return False


    def winnable(self,value,arr,state):
        if(self.checkRow(arr[0],state,value)):
            return True
        if(self.checkColumn(arr[1],state,value)):
            return True
        if(self.checkDiag(arr,state,value)):
            return True
        return False

    def getUpdate(self,arr,player):
        self.state[arr[0]][arr[1]]=player.value
        if(self.winnable(player.value,arr,self.state)):
            self.won=True
            self.winner=player.value
    
    def noMoves(self,state):
        for i in range(3):
            for j in range(3):
                if(state[i][j]==''):
                    return False
        return True
    
    def play(self,p1,p2,ui):
        #should start a new game and update the states
        while(not self.won and not self.noMoves(self.state)):
            [row,column]=self.getinput(p1)
            self.getUpdate([row,column],p1)
            ui.print(self.state)
            if(self.won or self.noMoves(self.state)):
                break
            [row,column]=self.getinput(p2)
            self.getUpdate([row,column],p2)
            ui.print(self.state)
        print('{} won!'.format(self.winner))