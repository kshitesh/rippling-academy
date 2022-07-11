class board():
    def row_boundary(self):
        for i in range(3):
            print('---',end='')
            if(i!=2):
                print(' ',end='')
        print('')
    
    def column_boundary(self,arr):
        for i in range(3):
            print('|',end='')
            if(arr[i]==''):
                print('   ',end='')
            else:
                print(' '+arr[i]+' ',end='')
        print('|')
    
    def print(self,state):
        for i in range(3):
            self.row_boundary()
            self.column_boundary(state[i])
        self.row_boundary()
