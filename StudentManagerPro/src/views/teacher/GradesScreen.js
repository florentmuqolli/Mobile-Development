import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../../services/axiosInstance";
import { BackArrowIcon } from "../../assets/Icons";
import ScreenWrapper from "../../hooks/ScreenWrapper";
import Toast from "react-native-toast-message";
import Ionicons from 'react-native-vector-icons/Ionicons';

const TeacherGradesScreen = () => {
  const navigation = useNavigation();
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [gradeValue, setGradeValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        const [classesRes, gradesRes] = await Promise.all([
        axiosInstance.get("/class/specific-class"),
        axiosInstance.get("/grades/my"),
        ]);
        setClasses(classesRes.data);
        setGrades(gradesRes.data);
        setFilteredGrades(gradesRes.data);
    } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 403) {
          Toast.show({
            type: "error",
            text1: "You do not have permission to perform this action",
          });
          return; 
        }
        Toast.show({
          type: "error",
          text1: "Failed to load data",
        });
    } finally {
        setLoading(false);
    }
  };


  const fetchStudentsForClass = async (classId) => {
    try {
      const res = await axiosInstance.get(`/enrollment/${classId}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response && error.response.status === 403) {
        Toast.show({
          type: "error",
          text1: "You do not have permission to perform this action",
        });
        return; 
      }
      Toast.show({
        type: "error",
        text1: "Failed to load students",
      });
    }
  };

  const openModal = () => {
    setSelectedClassId("");
    setSelectedStudentId("");
    setGradeValue("");
    setStudents([]);
    setModalVisible(true);
  };

  const handleAddGrade = async () => {
    if (!selectedClassId || !selectedStudentId || !gradeValue) {
        Toast.show({
          type: "error",
          text1: "One or more fields missing",
        });
      return ;
    }

    try {
      await axiosInstance.post("/grades", {
        class_id: selectedClassId,
        student_id: selectedStudentId,
        grade: parseFloat(gradeValue),
      });

      Toast.show({
        type: "success",
        text1: "Grade added",
      });
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error adding grade:", error);
      if (error.response && error.response.status === 403) {
        Toast.show({
          type: "error",
          text1: "You do not have permission to perform this action.",
        });
        return; 
      }
      Toast.show({
        type: "error",
        text1: "Failed to add grade",
      });
    }
  };

  const handleSearch = (text) => {
  setSearchQuery(text);

  if (text.trim() === "") {
    setFilteredGrades(grades);
  } else {
    const lowerText = text.toLowerCase();

    const filtered = grades.filter((grade) => {
      return (
        grade.student_id.toString().includes(lowerText) ||
        grade.class_id.toString().includes(lowerText) ||
        grade.grade.toString().includes(lowerText)
      );
    });

    setFilteredGrades(filtered);
  }
};


  const renderGrade = ({ item }) => (
    <View style={styles.gradeCard}>
      <View style={styles.gradeHeader}>
        <Text style={styles.gradeTitle}>Grade Record</Text>
        <Text style={styles.gradeValue}>{item.grade}</Text>
      </View>
      <View style={styles.gradeDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#6C5CE7" />
          <Text style={styles.detailText}>Student ID: {item.student_id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="school-outline" size={16} color="#6C5CE7" />
          <Text style={styles.detailText}>Class ID: {item.class_id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6C5CE7" />
          <Text style={styles.detailText}>
            {new Date(item.graded_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon/>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student ID, class ID, or grade..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Add New Grade</Text>
        </TouchableOpacity>

        {grades.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#636E72" />
            <Text style={styles.emptyText}>No grades recorded yet</Text>
            <Text style={styles.emptySubtext}>
              Add grades using the button above
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredGrades}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGrade}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Grade</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#636E72" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Select Class</Text>
              <View style={styles.selectContainer}>
                {classes.map((cls) => (
                  <TouchableOpacity
                    key={cls.id}
                    style={[
                      styles.optionButton,
                      selectedClassId === cls.id && styles.selectedOption,
                    ]}
                    onPress={() => {
                      setSelectedClassId(cls.id);
                      setSelectedStudentId("");
                      fetchStudentsForClass(cls.id);
                    }}
                  >
                    <Text style={styles.optionText}>{cls.title}</Text>
                    <Text style={styles.optionSubtext}>ID: {cls.id}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {students.length > 0 && (
                <>
                  <Text style={styles.label}>Select Student</Text>
                  <View style={styles.selectContainer}>
                    {students.map((student) => (
                      <TouchableOpacity
                        key={student.id}
                        style={[
                          styles.optionButton,
                          selectedStudentId === student.id && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedStudentId(student.id)}
                      >
                        <Text style={styles.optionText}>
                          Student ID: {student.id}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.label}>Enter Grade</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 85.50"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={gradeValue}
                  onChangeText={setGradeValue}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.submitButton]}
                  onPress={handleAddGrade}
                >
                  <Text style={styles.actionButtonText}>Submit Grade</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  searchInput: {
    marginTop: 20,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#2D3436",
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#6C5CE7",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  gradeCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gradeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  gradeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  gradeValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6C5CE7",
  },
  gradeDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#636E72",
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2D3436",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 4,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3436",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 8,
  },
  selectContainer: {
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: "#F8F9FA",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedOption: {
    backgroundColor: "#EDE7F6",
    borderColor: "#6C5CE7",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3436",
  },
  optionSubtext: {
    fontSize: 12,
    color: "#636E72",
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#2D3436",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#6C5CE7",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TeacherGradesScreen;
