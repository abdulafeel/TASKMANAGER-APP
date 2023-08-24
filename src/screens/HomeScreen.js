import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet,TextInput,Modal,TouchableOpacity,Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, deleteTask, updateTask, markTaskAsCompleted } from '../redux/actions/taskActions';
import { logoutUser } from '../redux/actions/authActions';
import { setThemeMode } from '../redux/actions/themeActions';
import * as Animatable from 'react-native-animatable';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const tasks = useSelector((state) => state.tasks.tasks);
  const themeMode = useSelector((state) => state.theme.themeMode); 
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('all');
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  console.log('Task',tasks)
  
  const isDarkMode = themeMode === 'dark';

  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.navigate('Login');

  };

  if (!isLoggedIn) {
    // Redirect to LoginScreen if not logged in
    navigation.navigate('Login');
    return null;
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== '') {
      const newTask = {
        id: new Date().getTime().toString(),
        title: newTaskTitle,
        completed: false,
      };
      dispatch(addTask(newTask));
      setNewTaskTitle('');
      setAddTaskModalVisible(false); // Close the modal after adding the task
    }
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const handleEditTask = (taskId, taskTitle) => {
    setEditedTask({ id: taskId, title: taskTitle });
    setEditedTaskTitle(taskTitle);
    setEditModalVisible(true);
  };

  const handleSaveEditedTask = () => {
    if (editedTaskTitle.trim() !== '') {
      dispatch(updateTask(editedTask.id, { title: editedTaskTitle }));
      setEditModalVisible(false);
      setEditedTask({});
      setEditedTaskTitle('');
    }
  };

  const handleMarkTaskCompleted = (taskId) => {
    dispatch(markTaskAsCompleted(taskId));
  };

  const filteredTasks = tasks
  .filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .filter((task) =>
      sortOrder === 'all' ? true : (sortOrder === 'completed' ? task.completed : !task.completed)
    );

  const handleToggleTheme = () => {
    const newThemeMode = isDarkMode ? 'light' : 'dark';
    dispatch(setThemeMode(newThemeMode));
  };


  return (
<View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F0F0F0' }]}>
      <View style={styles.header}>

        <TouchableOpacity onPress={handleToggleTheme}>
        <Feather name={isDarkMode ? 'sun' : 'moon'} size={24} color= {isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <SimpleLineIcons name="logout" size={24} color= {isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
      </View> 
      <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>
        Welcome, {user.email}!
      </Text>
      <View style={styles.searchSortContainer}>
      <AntDesign name="search1" size={28} color={isDarkMode ? '#ccc' : 'gray'} style={styles.searchIcon}/>
      <TextInput
        style={[styles.input, { color: isDarkMode ? '#ccc' : 'black' ,borderColor:isDarkMode ? 'white' : 'black'}]}
        placeholder="Search..."
        placeholderTextColor={isDarkMode ? '#ccc' : 'gray'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
        <Picker
        mode='dropdown'
        dropdownIconColor='white'
          selectedValue={sortOrder}
          style={styles.sortPicker}
          onValueChange={(itemValue) => setSortOrder(itemValue)}
        >
          <Picker.Item label="All" value="all" style={styles.pickerItem} />
          <Picker.Item label="Completed" value="completed"  style={styles.pickerItem} />
          <Picker.Item label="Pending" value="pending" style={styles.pickerItem} />
        </Picker>
      </View>
      <FlatList
        data={filteredTasks.length > 0 ? filteredTasks : tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeIn" duration={1000} style={styles.taskContainer}>
          <Text style={item.completed ? styles.completedTaskText : styles.taskText}>
              {item.title}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditTask(item.id, item.title)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleDeleteTask(item.id)}
            >
              <Text style={styles.editButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleMarkTaskCompleted(item.id)}
            >
              <Text style={styles.editButtonText}>Done</Text>
            </TouchableOpacity>
            </Animatable.View>
      )}
      removeClippedSubviews={false}
    />
    <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={[styles.modalContainer,{ backgroundColor: isDarkMode?'rgba(0, 0, 0, 0.7)':'rgba(0, 0, 0, 0.5)'}]}>
          <TextInput
            style={[styles.modalInput,{borderColor:isDarkMode?'white':'black'}]}
            placeholder="Edit task title"
            value={editedTaskTitle}
            onChangeText={setEditedTaskTitle}
          />
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={[styles.modalButton,{backgroundColor:isDarkMode?'gray':'black'}]}
              onPress={handleSaveEditedTask}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton,{backgroundColor:isDarkMode?'gray':'black'}]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addTaskModalVisible}
        onRequestClose={() => setAddTaskModalVisible(false)}
      >
        <View style={[styles.modalContainer,{ backgroundColor: isDarkMode?'rgba(0, 0, 0, 0.7)':'rgba(0, 0, 0, 0.5)'}]}>
          <Text style={[styles.modalTitle,{color:isDarkMode?'white':'black'}]}>Add New Task</Text>
          <TextInput
            style={[styles.modalInput,{borderColor:isDarkMode?'white':'black'}]}
            placeholder="Enter task title"
            placeholderTextColor="#ccc"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
          <Button title="Add Task" onPress={handleAddTask} color={isDarkMode?'gray':'black'}/>
          <View style={{marginTop:20}}></View>
          <Button title="Cancel" onPress={() => setAddTaskModalVisible(false)} color={isDarkMode?'gray':'black'} />
        </View>
      </Modal>

      {/* Add Task Button */}
      <TouchableOpacity
        style={[styles.addTaskButton,{backgroundColor:isDarkMode?'white':'black'}]}
        onPress={() => setAddTaskModalVisible(true)}
      >
        <Text style={[styles.addTaskButtonText,{color:isDarkMode?'black':'white'}]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoutButton: {
    fontSize: 16,
  },
  input:  {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    textAlign:'center'
  },
  searchSortContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedTaskText: {
    flex: 1,
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#888',
  },

  editButton: {
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal:2
  },
  editButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInput: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalButton: {
    width: '45%',
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    color:'white'
  },
  addTaskButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'black',
    width: 60,
    height: 60,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskButtonText: {
    color: 'white',
    fontSize: 34,
  },
  searchIcon:{
position:'absolute',
left:10,
top:10
  },
  sortContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  sortPicker: {
    width: 145,
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'black',
    padding: 0,
    fontSize: 14,
  },
  pickerItem:{
    padding: 0, 
    fontSize:10,
    textAlign:'center',
    color:'white',
    backgroundColor:'black'
  }
});

export default HomeScreen;
