import unittest
import sys

from boggle_solver import Boggle

sys.path.append("/home/codio/workspace/")  # Must set PATH for Boggle Class


class TestSuite_Alg_Scalability_Cases(unittest.TestCase):

    # ADD 4x4, 5x5, 6x6, 7x7...13x13, and LARGER Dictionaries
    def test_Normal_case_3x3(self):
        grid = [["A", "B", "C"], ["D", "E", "F"], ["G", "H", "Ie"]]
        dictionary = ["abc", "abdhie", "abie", "ef", "cfie", "dea"]
        mygame = Boggle(grid, dictionary)
        solution = mygame.getSolution()
        solution = [x.upper() for x in solution]
        expected = ["abc", "abdhie", "cfie", "dea"]
        expected = [x.upper() for x in expected]
        solution = sorted(solution)
        expected = sorted(expected)
        self.assertEqual(expected, solution)


class TestSuite_Simple_Edge_Cases(unittest.TestCase):

    # ADD MANY SIMPLE TEST CASES
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


class TestSuite_Complete_Coverage(unittest.TestCase):

    # ADD MANY COMPLEXED TEST CASES
    def test_case_1(self):
        self.assertEqual(True, True)


class TestSuite_Qu_and_St(unittest.TestCase):

    # ADD QU AND ST TEST CASES
    def test_case_1(self):
        self.assertEqual(True, True)


if __name__ == '__main__':
    unittest.main()
