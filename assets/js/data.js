/**
 * Quanta - Physics Education Platform
 * Mock Data for Application
 */

// Resources Data
const resourcesData = [
    {
        id: 1,
        title: "Quantum Mechanics Fundamentals",
        author: "Dr. Richard Feynman",
        category: "quantum",
        type: "book",
        difficulty: "intermediate",
        description: "A comprehensive introduction to the principles of quantum mechanics for undergraduate students.",
        rating: 4.9,
        views: 12540,
        createdAt: "2023-08-10",
        updatedAt: "2023-09-15"
    },
    {
        id: 2,
        title: "Introduction to Classical Mechanics",
        author: "Prof. Walter Lewin",
        category: "mechanics",
        type: "video",
        difficulty: "beginner",
        description: "A video series covering the basics of classical mechanics with demonstrations and problem solving.",
        rating: 4.8,
        views: 18650,
        createdAt: "2023-09-05",
        updatedAt: "2023-10-02"
    },
    {
        id: 3,
        title: "Electromagnetic Fields Simulation",
        author: "PhysicsLab",
        category: "electromagnetism",
        type: "simulation",
        difficulty: "advanced",
        description: "Interactive simulation that allows students to visualize and experiment with electromagnetic fields.",
        rating: 4.7,
        views: 8320,
        createdAt: "2023-10-20",
        updatedAt: "2023-11-12"
    },
    {
        id: 4,
        title: "Thermodynamics Problem Set",
        author: "Prof. Emily Johnson",
        category: "thermodynamics",
        type: "problem-set",
        difficulty: "advanced",
        description: "A collection of challenging problems in thermodynamics with step-by-step solutions.",
        rating: 4.6,
        views: 5890,
        createdAt: "2023-11-15",
        updatedAt: "2023-12-05"
    },
    {
        id: 5,
        title: "Special Relativity Explained",
        author: "Physics Explained",
        category: "relativity",
        type: "article",
        difficulty: "intermediate",
        description: "A clear and concise explanation of Einstein's special theory of relativity for physics students.",
        rating: 4.7,
        views: 9750,
        createdAt: "2023-12-10",
        updatedAt: "2024-01-10"
    },
    {
        id: 6,
        title: "Quantum Computing Basics",
        author: "Quantum Institute",
        category: "quantum",
        type: "video",
        difficulty: "expert",
        description: "Introduction to quantum computing principles and their applications in modern physics.",
        rating: 4.9,
        views: 7240,
        createdAt: "2024-01-25",
        updatedAt: "2024-02-18"
    },
    {
        id: 7,
        title: "Waves and Oscillations",
        author: "Dr. Sarah Adams",
        category: "mechanics",
        type: "book",
        difficulty: "intermediate",
        description: "Comprehensive guide to understanding mechanical and electromagnetic waves and oscillatory systems.",
        rating: 4.5,
        views: 6320,
        createdAt: "2023-07-18",
        updatedAt: "2023-08-22"
    },
    {
        id: 8,
        title: "Nuclear Physics and Its Applications",
        author: "Prof. Robert Chen",
        category: "quantum",
        type: "article",
        difficulty: "advanced",
        description: "Detailed overview of nuclear physics principles and their applications in medicine and energy.",
        rating: 4.6,
        views: 4890,
        createdAt: "2023-09-03",
        updatedAt: "2023-10-12"
    },
    {
        id: 9,
        title: "Fluid Dynamics Simulation",
        author: "MechLab",
        category: "mechanics",
        type: "simulation",
        difficulty: "advanced",
        description: "Interactive simulation for exploring fluid flow behavior under various conditions.",
        rating: 4.7,
        views: 5670,
        createdAt: "2023-10-15",
        updatedAt: "2023-11-20"
    },
    {
        id: 10,
        title: "Electricity and Magnetism",
        author: "Prof. Michael Faraday",
        category: "electromagnetism",
        type: "book",
        difficulty: "beginner",
        description: "Fundamental introduction to electricity, magnetism, and their interconnection.",
        rating: 4.8,
        views: 9820,
        createdAt: "2023-06-10",
        updatedAt: "2023-07-15"
    }
];

// Discussions Data
const discussionsData = [
    {
        id: 1,
        title: "Understanding wave-particle duality",
        content: "I'm struggling to conceptualize how something can be both a wave and a particle at the same time. Can someone explain this in simple terms, perhaps with an analogy that might help me grasp this concept better? I understand the double-slit experiment demonstrates this duality, but I'm having trouble reconciling these two seemingly contradictory properties.",
        tags: ["quantum", "wave-mechanics"],
        upvotes: 24,
        downvotes: 2,
        views: 128,
        isSolved: true,
        createdAt: "2024-04-02",
        user: {
            username: "PhysicsStudent101",
            isExpert: false
        }
    },
    {
        id: 2,
        title: "Problem with calculating angular momentum in rotating systems",
        content: "I'm trying to solve a problem involving angular momentum conservation, but I keep getting the wrong answer. Here's my approach: I'm using L = Iω for a system of particles, but the final value doesn't match the expected result. Am I missing something about how angular momentum works in non-rigid body systems? Any hints or tips would be appreciated!",
        tags: ["mechanics", "angular-momentum", "problem-solving"],
        upvotes: 18,
        downvotes: 1,
        views: 95,
        isSolved: false,
        createdAt: "2024-04-10",
        user: {
            username: "MechanicsLover",
            isExpert: false
        }
    },
    {
        id: 3,
        title: "Explaining the twin paradox in relativity",
        content: "What is the correct explanation for the twin paradox in special relativity? I understand time dilation but I'm confused about the asymmetry. If motion is relative, why does only one twin age less? I've read that it's because one twin accelerates (changes reference frames), but I'd appreciate a clearer explanation of why this resolves the paradox.",
        tags: ["relativity", "special-relativity", "time-dilation"],
        upvotes: 32,
        downvotes: 0,
        views: 210,
        isSolved: true,
        createdAt: "2024-04-15",
        user: {
            username: "Dr.SpaceTime",
            isExpert: true
        }
    },
    {
        id: 4,
        title: "Understanding Heisenberg's Uncertainty Principle",
        content: "I'm confused about the Heisenberg Uncertainty Principle. Is it a fundamental limit on our ability to measure properties, or is it a statement about the nature of quantum particles themselves? Are particles actually in defined states that we simply cannot measure precisely, or are they inherently probabilistic?",
        tags: ["quantum", "uncertainty-principle", "quantum-mechanics"],
        upvotes: 27,
        downvotes: 3,
        views: 165,
        isSolved: true,
        createdAt: "2024-03-28",
        user: {
            username: "QuantumCurious",
            isExpert: false
        }
    },
    {
        id: 5,
        title: "Derivation of the Navier-Stokes equations",
        content: "Can someone help me understand the derivation of the Navier-Stokes equations for fluid flow? I'm particularly confused about how we incorporate viscosity effects. The mathematical steps from the conservation laws to the final differential equations aren't clear to me.",
        tags: ["fluid-dynamics", "differential-equations", "mechanics"],
        upvotes: 15,
        downvotes: 0,
        views: 83,
        isSolved: false,
        createdAt: "2024-04-05",
        user: {
            username: "FluidMechanic",
            isExpert: false
        }
    }
];

// Exam Questions Data
const examQuestionsData = [
    {
        id: 1,
        topic: "mechanics",
        question: "A car accelerates from rest at a constant rate of 3 m/s². What is its velocity after 5 seconds?",
        options: [
            "5 m/s",
            "10 m/s",
            "15 m/s",
            "20 m/s"
        ],
        correctAnswer: 2, // index of correct option (15 m/s)
        explanation: "Using the formula v = u + at, where u is the initial velocity (0 m/s), a is acceleration (3 m/s²), and t is time (5 s): v = 0 + 3 × 5 = 15 m/s",
        difficulty: 1
    },
    {
        id: 2,
        topic: "quantum",
        question: "Which of the following is NOT a postulate of Bohr's model of the hydrogen atom?",
        options: [
            "Electrons move in circular orbits around the nucleus",
            "The energy of electrons is quantized",
            "Electrons emit radiation when moving in a stable orbit",
            "Angular momentum of electrons is quantized"
        ],
        correctAnswer: 2, // index of correct option (emission in stable orbit)
        explanation: "Bohr's model postulates that electrons only emit radiation when transitioning between orbits, not while moving in a stable orbit.",
        difficulty: 3
    },
    {
        id: 3,
        topic: "electromagnetism",
        question: "What is the magnetic field at the center of a circular loop of wire with radius 0.1 m carrying a current of 2 A?",
        options: [
            "4π × 10⁻⁷ T",
            "4π × 10⁻⁶ T",
            "2π × 10⁻⁵ T",
            "4π × 10⁻⁵ T"
        ],
        correctAnswer: 1, // index of correct option (4π × 10⁻⁶ T)
        explanation: "Using the formula B = μ₀I/2r, where μ₀ = 4π × 10⁻⁷ T·m/A, I = 2 A, and r = 0.1 m: B = (4π × 10⁻⁷ × 2)/(2 × 0.1) = 4π × 10⁻⁶ T",
        difficulty: 4
    },
    {
        id: 4,
        topic: "thermodynamics",
        question: "What happens to the internal energy of an ideal gas during an isothermal expansion?",
        options: [
            "It increases",
            "It decreases",
            "It remains constant",
            "It first increases then decreases"
        ],
        correctAnswer: 2, // index of correct option (remains constant)
        explanation: "In an isothermal process, the temperature remains constant. Since the internal energy of an ideal gas depends only on temperature (U = 3/2 nRT for a monatomic gas), it also remains constant.",
        difficulty: 3
    },
    {
        id: 5,
        topic: "relativity",
        question: "According to special relativity, what happens to a moving clock as observed by a stationary observer?",
        options: [
            "It runs faster",
            "It runs slower",
            "It runs at the same rate",
            "It sometimes runs faster and sometimes slower"
        ],
        correctAnswer: 1, // index of correct option (runs slower)
        explanation: "According to time dilation in special relativity, a moving clock runs slower than a stationary clock when observed from the stationary reference frame. This is given by t' = t/√(1-v²/c²), where t' is the dilated time.",
        difficulty: 2
    },
    {
        id: 6,
        topic: "mechanics",
        question: "A projectile is fired with an initial velocity of 50 m/s at an angle of 30° above the horizontal. What is its horizontal range on level ground? (g = 9.8 m/s²)",
        options: [
            "127.6 m",
            "219.4 m",
            "245.8 m",
            "255.1 m"
        ],
        correctAnswer: 2, // index of correct option (245.8 m)
        explanation: "The range formula is R = (v₀² × sin(2θ))/g = (50² × sin(60°))/9.8 = (2500 × 0.866)/9.8 ≈ 245.8 m",
        difficulty: 3
    },
    {
        id: 7,
        topic: "quantum",
        question: "What is the de Broglie wavelength of an electron (mass = 9.11 × 10⁻³¹ kg) moving at 1.0 × 10⁶ m/s? (h = 6.63 × 10⁻³⁴ J·s)",
        options: [
            "7.28 × 10⁻¹⁰ m",
            "7.28 × 10⁻⁹ m",
            "7.28 × 10⁻¹⁰ nm",
            "7.28 × 10⁻¹ nm"
        ],
        correctAnswer: 0, // index of correct option (7.28 × 10⁻¹⁰ m)
        explanation: "Using the de Broglie equation λ = h/mv = (6.63 × 10⁻³⁴)/(9.11 × 10⁻³¹ × 1.0 × 10⁶) = 7.28 × 10⁻¹⁰ m",
        difficulty: 4
    }
];

// User Data
const usersData = [
    {
        id: 1,
        username: "PhysicsStudent101",
        email: "student101@example.com",
        profileImage: null,
        isExpert: false,
        createdAt: "2023-10-15"
    },
    {
        id: 2,
        username: "Dr.SpaceTime",
        email: "drspacetime@example.com",
        profileImage: null,
        isExpert: true,
        createdAt: "2023-09-20"
    },
    {
        id: 3,
        username: "QuantumCurious",
        email: "quantum@example.com",
        profileImage: null,
        isExpert: false,
        createdAt: "2023-11-05"
    }
];

// User Progress Data
const userProgressData = [
    {
        id: 1,
        userId: 1,
        topic: "mechanics",
        score: 75,
        completion: 68,
        createdAt: "2024-03-10",
        updatedAt: "2024-04-15"
    },
    {
        id: 2,
        userId: 1,
        topic: "quantum",
        score: 62,
        completion: 45,
        createdAt: "2024-02-20",
        updatedAt: "2024-04-12"
    },
    {
        id: 3,
        userId: 2,
        topic: "relativity",
        score: 95,
        completion: 100,
        createdAt: "2024-01-15",
        updatedAt: "2024-03-20"
    }
];

// Constants
const CATEGORIES = [
    { value: "all", label: "All Categories" },
    { value: "mechanics", label: "Mechanics" },
    { value: "quantum", label: "Quantum Physics" },
    { value: "electromagnetism", label: "Electromagnetism" },
    { value: "thermodynamics", label: "Thermodynamics" },
    { value: "relativity", label: "Relativity" }
];

const RESOURCE_TYPES = [
    { value: "all", label: "All Types" },
    { value: "book", label: "Books" },
    { value: "video", label: "Videos" },
    { value: "simulation", label: "Simulations" },
    { value: "article", label: "Articles" },
    { value: "problem-set", label: "Problem Sets" }
];

const DIFFICULTY_LEVELS = [
    { value: "all", label: "All Difficulties" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" }
];