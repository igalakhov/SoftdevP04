# 🪒ISOEIS Is Searching The Online Encyclopedia of Integer Sequences

### What is this project?

The OEIS is an online repository of forumula's to generate integer sequences. It's often interesting to input in random integers, 
and see what equations can generate the inputted integers.  

Our app visualizes this using a system of nodes and links. 
One sequence is visualized as a left-to-right sequence of nodes, and when two sequences share an integer in the same spot, they share a node.  

Each sequence is given a unique color of link, and nodes are hoverable to reveal what sequence(s) the node belongs to. 
The central nodes will always remain editable, so the user can tinker with slightly adjusting the inputs and seeing what sequences are generated.  

### API's Used
PyOEIS is a python library that interfaces with the OEIS and facilitates sequence operations.  
We use this API to retrieve the data which we then parse and present to the user.  

### How to Run
``` 
git clone git@github.com:igalakhov/SoftdevP04.git
cd Softdev P04
make install  
make run
```
### [Video Demo Here](https://www.youtube.com/watch?v=77qr-4MRiqM&feature=youtu.be)

#### Dependencies 
- python3
- pip3
- make
- at least 10 mb free space




### The Team
Project Manager- Ivan Galakhov  
Front End Engineer- Moududur "Moody" Rahman  
Flask Technician- Jude Rizzo


#### Powered with Flask, D3.js, pizza and Love
