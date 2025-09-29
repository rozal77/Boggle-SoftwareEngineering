import unittest
import sys

sys.path.append("/home/codio/workspace/") #have to tell the unittest the PATH to find boggle_solver.py and the Boggle Class

from boggle_solver import Boggle

class TestSuite_Alg_Scalability_Cases(unittest.TestCase):

  # ADD 4x4, 5x5, 6x6, 7x7...13x13, and LARGER Dictionaries
  def test_Normal_case_3x3(self):
    grid = [["A", "B", "C"],["D", "E", "F"],["G", "H", "I"]]
    dictionary = ["abc", "abdhi", "abi", "ef", "cfi", "dea"]
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    expected = ["abc", "abdhi", "cfi", "dea"];
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(expected, solution)

  def test_Normal_case_5x5(self):
    grid = [['qu', 'a', 'x', 'st', 'l'], ['a', 'r', 'r', 'i', 'l'], ['y', 'f', 'i', 'e', 'd'], ['m', 'r', 'i', 'c', 'k'], ['a', 'n', 'd', 'm', 'o']]
    dictionary = ['hawaii', 'hero', 'academia', 'army', 'ciel', 'derrick', 'still', 'arf']
    mygame = Boggle(grid,dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    expected = ['arf', 'army', 'ciel', 'derrick', 'still']
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(expected, solution)

  def test_Normal_case_7x7(self):
    grid = [["A", "B", "C", "D", "E", "F", "G"],["H", "I", "J", "K", "L", "M", "N"],["O", "P", "Qu", "R", "U", "V", "W"],["X", "Y", "Z", "A", "B", "C", "D"],["E", "F", "G", "H", "I", "J", "K"],["L", "M", "N", "O", "P", "R", "R"],["U", "V", "W", "X", "Y", "Z", "A"]]
    dictionary = ["abc", "abcf", "pqu", "yzab", "abcdef", "hijklmnop", "vwxyz", "quuvwxyz"]
    mygame = Boggle(grid,dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    expected = ['abc', 'abcdef', 'pqu', 'vwxyz', 'yzab']
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(expected, solution)
    


class TestSuite_Simple_Edge_Cases(unittest.TestCase):
  #ADD MANY SIMPLE TEST CASES
  def test_SquareGrid_case_1x1(self):
    grid = [["A"]]
    dictionary = ["a", "b", "c"]
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    expected = []
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(expected, solution)

  # empty grid
  def test_EmptyGrid_case_0x0(self):
    grid = [[]]
    dictionary = ["hello", "there", "general", "kenobi"]
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    expected = []
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(expected, solution)

  #empty grid and empty dictionary
  def test_empty_grid_and_empty_dict(self):
        grid = []
        dictionary = []
        mygame = Boggle(grid, dictionary)
        solution = mygame.getSolution()
        expected = []
        self.assertEqual(solution,expected)  
  
  #no word in dictiionary
  def test_case_no_word_in_dictionary(self):  
        grid = [["A", "B"], ["C", "D"]]
        dictionary = ["xyz", "nop"]
        mygame = Boggle(grid, dictionary)
        solution = mygame.getSolution()
        solution = [x.upper() for x in solution]
        expected = []
        self.assertEqual(solution,solution)

  # repetaion of same tiles
  def test_case_with_repeated_tiles(self):
      grid = [["A", "B", "C"],["D", "E", "F"],["G", "H", "I"]]
      dictionary = ["aabc","bcffi","efhi"]
      mygame = Boggle(grid, dictionary)
      solution = mygame.getSolution()
      solution = [x.upper() for x in solution]
      expected = ["efhi"]
      solution = sorted(solution)
      expected = sorted(expected)
      self.assertEqual(solution,solution)
 
        
class TestSuite_Complete_Coverage(unittest.TestCase):
        
  # word that cover entire grid
  def test_Word_That_Take_The_Entire_Grid(self):
    grid = [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]]
    # The word "abcdefghi" covers the entire grid in a snake-like manner
    dictionary = ["abcfedghi","defh","de"]
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    expected = ["abcfedghi","defh"]
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(solution,expected)

  # recurse on the diagonal
  def test_diagonal_recursion(self):
    grid = [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]]
    dictionary = ["aei", "cfi", "beh", "abd"]
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    expected = ["aei", "cfi", "beh", "abd"]
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(solution,expected) 

  # test with no adjacent letters in dictionary
  def test_non_adjacent_letters(self):
    grid = [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]]
    dictionary = ["aei", "abc", "ace", "cfg"]
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    # "ace"  and "cfg" should be skipped because the letters are not adjacent
    expected = ["abc", "aei"]
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(solution,expected)
  
  # words that are shorter than 3 letters
  def test_short_words(self):
    grid = [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "I"]]
    dictionary = ["ab", "de", "c", "ghi"]
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    # Words shorter than 3 characters should be skipped
    expected = ["ghi"]
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(solution,expected)
  
  # Grid that contain Q and S as a single tile
  def test_Q_as_single_tiles(self):
    grid = [['a', 'b', 'c', 'j', 'k', 's'], ['d', 'e', 'f', 'm', 'n', 'o'], ['g', 'h', 'i', 'p', 'q', 'r'], ['u', 'v', 'w', 'x', 'y'], ['e', 'i', 'n', 'o', 'u']]
    dictionary = ['edb', 'ebc', 'ecb', 'egh', 'ehi', 'def', 'pqr', 'jks', 'eab', 'sor', 'eih', 'efb']
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    #because the grid is invalid so the result must be empty
    expected = []
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(solution,expected)

  # Grid that contain Q and S as a single tile
  def test_S_as_single_tiles(self):
     grid = [['a', 'b', 's', 't'], ['e', 's', 'e', 'm'], ['s', 'n', 'i', 'o'], ['s', 'e', 's', 'u']]
     dictionary = ['abstemiousnessesa', 'asbestos', 'abstemiousnesses', 'sessensuoimetsba']
     mygame = Boggle(grid, dictionary)
     solution = mygame.getSolution()
     solution = [x.upper() for x in solution]
     #because the grid is invalid so the result must be empty
     expected = []
     expected = [x.upper() for x in expected]
     solution = sorted(solution)
     expected = sorted(expected)
     self.assertEqual(solution,expected)

  # Containing double letters tiles(QX(where x!=u) and Sx(where x!=t)) other than QU and ST   
  def test_double_letters_tiles_other_than_QU_and_ST(self):
    grid = [["A", "Qx", "C"],["D", "E", "F"],["p", "H", "I"]]
    dictionary = ["aqxc","def","efhi"]
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    #because the grid is invalid so the result must be empty
    expected = []
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(solution,expected)

class TestSuite_Qu_and_St(unittest.TestCase):
  #ADD QU AND ST TEST CASES in single grid
  def test_case_1(self): 
    grid = [["Qu", "B"], ["St", "D"]]
    dictionary = ["qubd", "stbd", "qust"]
    mygame = Boggle(grid, dictionary)
    solution = mygame.getSolution()
    solution = [x.upper() for x in solution]
    expected = ["qubd", "stbd", "qust"]
    expected = [x.upper() for x in expected]
    solution = sorted(solution)
    expected = sorted(expected)
    self.assertEqual(solution, expected)

  #ADD QU only in grid
  def test_case_2(self):
      grid = [['A', 'Qu'], ['C', 'D']]
      dictionary = ["aqu","cd","acd"]
      mygame = Boggle(grid, dictionary)
      solution = mygame.getSolution()
      solution = [x.upper() for x in solution]
      expected = ["aqu","acd"]
      expected = [x.upper() for x in expected]
      solution = sorted(solution)
      expected = sorted(expected)
      self.assertEqual(solution, expected)

  #ADD ST only in grid
  def test_case_3(self):
     grid  = [['t', 'w', 'y', 'r'], ['e', 'n', 'p', 'h'], ['g', 'z', 'st', 'r'], ['o', 'n', 't', 'a']]
     dictionary = ['ten', 'new', 'start', 'gent', 'not', 'newt', 'prat', 'rat', 'arty', 'wet', 'ego', 'art', 'quartz', 'pry', 'went', 'quar', 'rhr', 'qua', 'net', 'get', 'tar', 'tarp']
     mygame = Boggle(grid, dictionary)
     solution = mygame.getSolution()
     solution = [x.upper() for x in solution]
     expected = ['art', 'ego', 'gent', 'get', 'net', 'new', 'newt', 'prat', 'pry', 'rat', 'rhr', 'start', 'tar', 'tarp', 'ten', 'went', 'wet']
     expected = [x.upper() for x in expected]
     solution = sorted(solution)
     expected = sorted(expected)
     self.assertEqual(solution, expected)

   # self.assertEqual(True, True)

if __name__ == '__main__':
    unittest.main()