import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { MMKV } from 'react-native-mmkv';

// Initiate MMKV storage
export const storage = new MMKV();

export default function App() {
  
  const [task, setTask] = useState('');
  
  const [tasks, setTasks] = useState([]);

  // Load data dari MMKV saat startup
  useEffect(() => {
    const loadTasks = () => {
      const tasksString = storage.getString('tasks');
      if (tasksString) {
        setTasks(JSON.parse(tasksString));
      }
    };
    loadTasks();
  }, []);

  // Simpan data ke MMKV setiap ada "task" yang berubah
  useEffect(() => {
    storage.set('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Tambah task baru
  const handleAddTask = () => {
    if (task.trim().length === 0) {
      alert('Tugas tidak boleh kosong!');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      text: task,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTask(''); // Kosongkan input
    Keyboard.dismiss();
  };

  // Hapus tugas berdasarkan ID
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Ubah status 'completed' pada tugas
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskTextContainer}
        onPress={() => handleToggleComplete(item.id)}>
        <Text style={styles.checkbox}>
          {item.completed ? '[✓]' : '[  ]'}
        </Text>
        <Text
          style={[
            styles.taskText,
            item.completed && styles.taskTextCompleted,
          ]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id)}>
        <Text style={styles.deleteButtonText}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Daftar Tugas Harian</Text>

        {/* Form Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ketik tugas baru..."
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Text style={styles.addButtonText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* Daftar Tugas */}
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Belum ada tugas.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e3a8a',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  taskTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    fontSize: 18,
    marginRight: 10,
    color: '#2563eb',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#6b7280',
    fontSize: 16,
  },
});