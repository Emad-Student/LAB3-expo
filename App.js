import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Server error: ' + res.status);
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function createPost() {
    if (!title.trim() || !body.trim() || !userId.trim()) {
      setSubmitError('All fields are required.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          userId: parseInt(userId.trim(), 10),
        }),
      });
      if (!res.ok) throw new Error('Server error: ' + res.status);
      const data = await res.json();
      setSubmitResult(data);
      setTitle('');
      setBody('');
      setUserId('');
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardId}>#{item.id}</Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardBody}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.header}>Posts</Text>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Add New Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder="Body"
            value={body}
            onChangeText={setBody}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="User ID (number)"
            value={userId}
            onChangeText={setUserId}
            keyboardType="numeric"
          />
          {submitError && <Text style={styles.errorText}>{submitError}</Text>}
          {submitResult && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>Post created successfully!</Text>
              <Text style={styles.successDetail}>
                ID: {submitResult.id} | Title: {submitResult.title}
              </Text>
            </View>
          )}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={createPost}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.listHeader}>All Posts</Text>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading posts...</Text>
          </View>
        )}

        {error && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.button} onPress={fetchPosts}>
              <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPost}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No posts found.</Text>
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#f9fafb',
  },
  inputMulti: {
    height: 70,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#1d4ed8',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  successBox: {
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  successText: {
    color: '#065f46',
    fontWeight: '600',
    fontSize: 14,
  },
  successDetail: {
    color: '#065f46',
    fontSize: 13,
    marginTop: 2,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 8,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardId: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 13,
    color: '#6b7280',
  },
  centered: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 30,
    fontSize: 15,
  },
});
