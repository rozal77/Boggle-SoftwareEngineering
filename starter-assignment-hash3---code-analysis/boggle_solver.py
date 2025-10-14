"""
Boggle Solver: Finds all valid words in a Boggle-style grid using
Depth First Search (DFS).


The solver works by traversing an N x M grid of letters (or multi-letter
cells like "Qu"). It uses a pre-built prefix set derived from the
dictionary for efficient pruning during the DFS, ensuring that only paths
that can form a known word are explored.

Inputs:
- grid: A list of lists representing the Boggle board. All cells are
  treated as a single unit.
- dictionary: A collection of valid words.

Outputs:
- A sorted list of unique valid words found on the grid.

Rules:
- Cells can be moved to in 8 directions (including diagonals) by default.
- A cell cannot be used more than once per word.
- Words must meet a minimum length (default is 3).
"""


class Boggle:
    # Class constant for default minimum word length
    DEFAULT_MIN_LEN = 3

    def __init__(self, grid, dictionary, min_len=DEFAULT_MIN_LEN,
                 allow_diagonals=True):
        """
        Initializes the Boggle game instance.

        :param grid: The Boggle board (list of lists of strings).
        :param dictionary: A list or set of valid words.
        :param min_len: The minimum required length for a word.
        :param allow_diagonals: If True, diagonal moves are allowed.
        """
        self.setGrid(grid)
        self.setDictionary(dictionary)
        self.min_len = min_len
        self.allow_diagonals = allow_diagonals
        self.solution = set()  # Stores found words

    # ----------------------------------------------------------------------
    # Grid Setup Methods
    # ----------------------------------------------------------------------
    def setGrid(self, grid):
        """
        Normalizes the grid to uppercase and calculates dimensions.
        Handles non-rectangular grids by only processing the minimum
        dimensions. It clarifies that multi-letter cells (like 'Qu')
        are treated as a single unit.
        """
        # Normalize all cell values to uppercase
        self.grid = [[cell.upper() for cell in row] for row in grid]
        self.rows = len(self.grid)

        # Safely determine the number of columns (handles empty or
        # non-rectangular grids)
        self.cols = (min(len(row) for row in self.grid)
                     if self.rows > 0 and self.grid[0] else 0)

        # Initialize the visited matrix
        self.visited = [[False for _ in range(self.cols)]
                        for _ in range(self.rows)]

    # ----------------------------------------------------------------------
    # Dictionary and Prefix Methods
    # ----------------------------------------------------------------------
    def setDictionary(self, dictionary):
        """
        Normalizes the dictionary and builds the prefix set for efficient
        search. Whitespace is stripped from each word for robustness.
        """
        # Normalize, strip whitespace, and convert to a set for O(1) lookups
        self.dictionary = set(word.strip().upper() for word in dictionary)
        self.prefix_set = self._build_prefix_set(self.dictionary)

    def _build_prefix_set(self, dictionary):
        """
        Private method to precompute a set of all possible prefixes for the
        dictionary words.
        """
        prefix_set = set()
        for word in dictionary:
            for i in range(1, len(word) + 1):
                prefix_set.add(word[:i])
        return prefix_set

    # ----------------------------------------------------------------------
    # Solution Retrieval and Validation
    # ----------------------------------------------------------------------
    def getSolution(self):
        """
        Finds all words in the grid and returns them as a sorted list.
        The words are returned in uppercase, consistent with the internal
        representation.
        """
        self.solution.clear()  # Clear any previous solutions for a fresh start
        self.findAllWords()
        return sorted(list(self.solution))

    def isValidWord(self, word):
        """
        Checks if a path forms a valid word (in the dictionary and meets
        min length).
        """
        return word in self.dictionary and len(word) >= self.min_len

    def isValidPrefix(self, prefix):
        """
        Checks if a path is a valid prefix of any word in the dictionary.
        """
        return prefix in self.prefix_set

    # ----------------------------------------------------------------------
    # Search Methods (DFS)
    # ----------------------------------------------------------------------
    def findAllWords(self):
        """
        Iterates over every cell in the grid to start a Depth First Search
        (DFS).
        """
        # Ensure visited state is clean before starting
        self.visited = [[False for _ in range(self.cols)]
                        for _ in range(self.rows)]

        for row in range(self.rows):
            for col in range(self.cols):
                self.dfs(row, col, "")

    def dfs(self, row, col, path):
        """
        Performs Depth First Search (DFS) starting from a cell.

        :param row: Current row index.
        :param col: Current column index.
        :param path: The string of letters accumulated so far.
        """
        # 1. Check bounds and visited status
        if (row < 0 or col < 0 or row >= self.rows or
                col >= self.cols or self.visited[row][col]):
            return

        # 2. Append current letter and check for prefix pruning
        letter = self.grid[row][col]
        new_path = path + letter

        if not self.isValidPrefix(new_path):
            return  # Prune search path: no word can be formed from this prefix

        # 3. Mark cell as visited for this path
        self.visited[row][col] = True

        # 4. Check if the new path is a valid word
        if self.isValidWord(new_path):
            self.solution.add(new_path)

        # 5. Explore neighbors
        d_range = [-1, 0, 1]

        for drow in d_range:
            for dcol in d_range:
                # Skip the current cell (drow=0, dcol=0)
                if drow == 0 and dcol == 0:
                    continue

                # If diagonals are disallowed, skip movements where both drow
                # and dcol are non-zero
                if not self.allow_diagonals and drow != 0 and dcol != 0:
                    continue

                # Recursive call
                self.dfs(row + drow, col + dcol, new_path)

        # 6. Backtrack: Unmark the cell as visited (the reset per path is
        # inherent to DFS backtracking)
        self.visited[row][col] = False


def main():
    # --- Demo Setup ---
    # Note: "Qu" is treated as a single cell. All input is automatically
    # uppercased.
    grid = [
        ["T", "W", "Y", "R"],
        ["E", "N", "P", "H"],
        ["G", "Z", "Qu", "R"],
        ["O", "N", "T", "A"]
    ]

    # Dictionary with a mix of casing and potential whitespace
    dictionary = ["art", "ego", "gent", "get", "net", "new", "newt",
                  "prat", "pry", "qua", "quart", "quartz", "rat",
                  "tar", "tarp", "ten", "went", "wet", "arty", "rhr",
                  "not", "quar", "   TAR "]  # Example with whitespace

    # --- Scenario 1: Default Boggle (min_len=3, diagonals=True) ---
    print("--- Scenario 1: Default Boggle (min_len=3, diagonals=True) ---")
    mygame = Boggle(grid, dictionary)
    solution_default = mygame.getSolution()
    print("Found Words:", solution_default)

    print("-" * 50)

    # --- Scenario 2: Different Rules (min_len=4, diagonals=False) ---
    print("--- Scenario 2: Min Length 4, No Diagonals ---")
    mygame_strict = Boggle(grid, dictionary, min_len=4,
                           allow_diagonals=False)
    solution_strict = mygame_strict.getSolution()
    print("Found Words:", solution_strict)


if __name__ == "__main__":
    main()
