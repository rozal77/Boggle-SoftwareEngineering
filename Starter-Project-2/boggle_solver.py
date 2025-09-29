'''
Rojal Sapkota
003086974
'''
class Boggle:
    def __init__(self, grid, dictionary):
        self.setGrid(grid)
        self.setDictionary(dictionary)
        self.solution = set() # Constructor Defines a solution Set
    
    def setGrid(self, grid):
      self.grid = [[cell.upper() for cell in row] for row in grid]
      self.rows = len(self.grid)
      self.cols = len(self.grid[0]) if self.rows > 0 else 0
      self.visited = [[False for _ in range(self.cols)] for _ in range (self.rows)]

    def setDictionary(self, dictionary):
      self.dictionary = set(word.upper() for word in dictionary)
      self.prefix_set = self.build_prefix_set(self.dictionary)

    def build_prefix_set(self, dictionary):
      prefix_set = set()
      for word in dictionary:
        for i in range(1, len(word) + 1):
          prefix_set.add(word[:i])
      return prefix_set

    def getSolution(self):
      self.solution.clear() # Clear any previous solutions for a fresh start
      self.findAllWords()
      return sorted(list(self.solution))

    def isValidWord(self, word):
      return word in self.dictionary and len(word) >= 3

    def isValidPrefix(self, prefix):
      return prefix in self.prefix_set
    
    def findAllWords(self):
      for row in range(self.rows):
        for col in range(self.cols):
          self.dfs(row, col, "")
    
    def dfs(self, row, col, path):
      if row < 0 or col < 0 or row >= self.rows or col >= self.cols or self.visited[row][col]:
        return
      
      letter = self.grid[row][col]
      new_path = path + letter

      if not self.isValidPrefix(new_path):
        return

      self.visited[row][col] = True

      if self.isValidWord(new_path):
        self.solution.add(new_path)

      for drow in [-1, 0, 1]:
        for dcol in [-1, 0, 1]:
          if drow == 0 and dcol == 0:
            continue
          self.dfs(row + drow, col + dcol, new_path)
      
      self.visited[row][col] = False

def main():
  # Main Function to initialize
    grid = [["T", "W", "Y", "R"], ["E", "N", "P", "H"],["G", "Z", "Qu", "R"],["O", "N", "T", "A"]]
    dictionary = ["art", "ego", "gent", "get", "net", "new", "newt", "prat", "pry", "qua", "quart", "quartz", "rat", "tar", "tarp", "ten", "went", "wet", "arty", "rhr", "not", "quar"]
    
    # Creates an object for Boggle Class
    mygame = Boggle(grid, dictionary)
    print(mygame.getSolution())

if __name__ == "__main__":
    main()