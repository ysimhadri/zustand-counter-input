# LeetCode Solutions
```Save any LeetCode solutions I share to leetcode-solutions.md in this project.```
## Two Sum (LeetCode #1)

**Approach:** Brute Force — O(n²) time, O(1) space

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int len = nums.length;

        for (int i = 0; i < len; i++) {
            for (int j = i + 1; j < len; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[] {i, j};
                }
            }
        }
        return new int[0];
    }
}
```

**Notes:** Nested loop checks every pair. Returns indices of the two numbers that add up to `target`.

---

## Two Sum (LeetCode #1)

**Approach:** Sort + Two Pointers — O(n log n) time, O(n) space

```java
import java.util.Arrays;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;

        // Step 1: store value + original index
        int[][] arr = new int[n][2];
        for (int i = 0; i < n; i++) {
            arr[i][0] = nums[i]; // value
            arr[i][1] = i;       // original index
        }

        // Step 2: sort based on value
        Arrays.sort(arr, (a, b) -> a[0] - b[0]);

        // Step 3: two pointers
        int left = 0, right = n - 1;

        while (left < right) {
            int sum = arr[left][0] + arr[right][0];

            if (sum == target) {
                return new int[] {arr[left][1], arr[right][1]};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }

        return new int[0]; // no solution
    }
}
```

**Notes:** Preserves original indices by pairing values with their index before sorting. Two pointers converge from both ends after sort.

---

## Two Sum (LeetCode #1)

**Approach:** HashMap (Modern Java) — O(n) time, O(n) space

```java
import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        var map = new HashMap<Integer, Integer>();

        for (int i = 0; i < nums.length; i++) {
            var complement = target - nums[i];

            if (map.containsKey(complement)) {
                return new int[] {map.get(complement), i};
            }

            map.put(nums[i], i);
        }

        return new int[0];
    }
}
```

**Notes:** Uses `var` (Java 10+) for local type inference. Single pass — best of the three approaches.
