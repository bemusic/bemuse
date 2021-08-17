/// <reference types="node" />

export declare interface BaseTimingAction {
    /** where this action occurs */
    beat: number;
}

declare type BMSChannelNoteMapping = {
    [channel: string]: string;
};

/**
 * A BMSChart holds information about a particular BMS notechart.
 * Note that a BMSChart does not contain any information about `#RANDOM`,
 * as they are already processed after compilation.
 *
 * There is not many useful things you can do with a BMSChart other than
 * accessing the header fields and objects inside it.
 *
 * To extract information from a BMSChart,
 * please look at the documentation of higher-level classes,
 * such as {Keysounds}, {Notes}, and {Timing}.
 */
export declare class BMSChart {
    headers: BMSHeaders;
    objects: BMSObjects;
    timeSignatures: TimeSignatures;
    constructor();
    /**
     * Public: Converts measure number and fraction into beat.
     * A single beat is equivalent to a quarter note in common time signature.
     *
     * @param {number} measure representing the measure number, starting from 0
     * @param {number} fraction representing the fraction inside that measure, from 0 to 1
     */
    measureToBeat(measure: number, fraction: number): number;
}

declare interface BMSChartOptions {
    /**
     * The mapping from BMS channel to game channel.
     * Default value is the IIDX_P1 mapping.
     */
    mapping?: BMSChannelNoteMapping;
}

declare interface BMSCompileOptions {
    /** File format */
    format: 'bms' | 'dtx';
    /** A function that generates a random number.
     *  It is used when processing `#RANDOM n` directive.
     *  This function should return an integer number between 1 and `n`.
     */
    rng: (max: number) => number;
}

/**
 * A BMSHeader holds the header information in a BMS file, such as
 * `#TITLE`, `#ARTIST`, or `#BPM`.
 *
 * You get retrieve a header using the `get()` method:
 *
 * ```js
 * chart.headers.get('title')
 * ```
 *
 * For some header fields that may contain multiple values, such as `#SUBTITLE`,
 * you can get them all using `getAll()`:
 *
 * ```js
 * chart.headers.getAll()
 * ```
 */
export declare class BMSHeaders {
    private _data;
    private _dataAll;
    constructor();
    /**
     * Iterates through each header field using a callback function.
     * @param callback will be called for each header field
     */
    each(callback: (key: string, value: string) => any): void;
    /**
     * Retrieves the header field’s latest value.
     * @param name field’s name
     * @return the field’s latest value
     */
    get(name: string): string | undefined;
    /**
     * Retrieves the header field’s values.
     * This is useful when a header field is specified multiple times.
     * @param name field’s name
     */
    getAll(name: string): string[] | undefined;
    /**
     * Sets the header field’s value.
     * @param name field’s name
     * @param value field’s value
     */
    set(name: string, value: string): void;
}

/** A single note in a notechart. */
export declare interface BMSNote {
    beat: number;
    endBeat?: number;
    column?: string;
    keysound: string;
    /**
     * [bmson] The number of seconds into the sound file to start playing
     */
    keysoundStart?: number;
    /**
     * [bmson] The {Number} of seconds into the sound file to stop playing.
     * This may be `undefined` to indicate that the sound file should play until the end.
     */
    keysoundEnd?: number;
}

/** An object inside a {BMSChart}. */
export declare interface BMSObject {
    /** the raw two-character BMS channel of this object */
    channel: string;
    /** the measure number, starting at 0 (corresponds to `#000`) */
    measure: number;
    /**
     * the fractional position inside the measure,
     * ranging from 0 (inclusive) to 1 (exclusive).
     * 0 means that the object is at the start of the measure,
     * whereas 1 means that the object is at the end of the measure.
     */
    fraction: number;
    /** the raw value of the BMS object. */
    value: string;
}

/**
 * BMSObjects holds a collection of objects inside a BMS notechart.
 */
export declare class BMSObjects {
    private _objects;
    constructor();
    /**
     * Adds a new object to this collection.
     * If an object already exists on the same channel and position,
     * the object is replaced (except for autokeysound tracks).
     * @param object the object to add
     */
    add(object: BMSObject): void;
    /**
     * Returns an array of all objects.
     */
    all(): BMSObject[];
    /**
     * Returns a sorted array of all objects.
     */
    allSorted(): BMSObject[];
}

export declare interface BPMTimingAction extends BaseTimingAction {
    type: 'bpm';
    /** BPM to change to */
    bpm: number;
}

declare namespace ChannelMapping {
    export {
        IIDX_P1
    }
}

/**
 * Reads the string representing the BMS notechart, parses it,
 * and compiles into a {BMSChart}.
 * @param text the BMS notechart
 * @param options additional parser options
 */
declare function compile(text: string, options?: Partial<BMSCompileOptions>): {
    headerSentences: number;
    channelSentences: number;
    controlSentences: number;
    skippedSentences: number;
    malformedSentences: number;
    /**
     * The resulting chart
     */
    chart: BMSChart;
    /**
     * Warnings found during compilation
     */
    warnings: {
        lineNumber: number;
        message: string;
    }[];
};

declare namespace Compiler {
    export {
        compile,
        BMSCompileOptions
    }
}
export { Compiler }

/**
 * Given the filename, returns the reader options.
 * @param {string} filename
 */
declare function getReaderOptionsFromFilename(filename: string): {
    forceEncoding: string | undefined;
};

declare const IIDX_P1: {
    11: string;
    12: string;
    13: string;
    14: string;
    15: string;
    18: string;
    19: string;
    16: string;
};

export declare interface ISongInfoData {
    title: string;
    artist: string;
    genre: string;
    subtitles: string[];
    subartists: string[];
    difficulty: number;
    level: number;
}

/**
 * A simple mapping between keysounds ID and the file name.
 * ## Example
 *
 * If you have a BMS like this:
 *
 * ```
 * #WAVAA cat.wav
 * ```
 *
 * Having parsed it using a {Compiler} into a {BMSChart},
 * you can create a {Keysounds} using `fromBMSChart()`:
 *
 * ```js
 * var keysounds = Keysounds.fromBMSChart(bmsChart)
 * ```
 *
 * Then you can retrieve the filename using `.get()`:
 *
 * ```js
 * keysounds.get('aa') // => 'cat.wav'
 * ```
 */
export declare class Keysounds {
    _map: {
        [id: string]: string;
    };
    constructor(map: {
        [id: string]: string;
    });
    /**
     * Returns the keysound file at the specified ID.
     * @param id the two-character keysound ID
     * @returns the sound filename
     */
    get(id: string): string | undefined;
    /**
     * Returns an array of unique filenames in this Keysounds object.
     * @returns filenames array
     */
    files(): string[];
    /**
     * Returns a mapping from keysound ID to keysound filename.
     *
     * **Warning:** This method returns the internal data structure used
     * in this Keysounds object. Do not mutate!
     */
    all(): {
        [id: string]: string;
    };
    /**
     * Constructs a new {Keysounds} object from a {BMSChart}.
     * @param chart
     */
    static fromBMSChart(chart: BMSChart): Keysounds;
}

/**
 * A Notes holds the {Note} objects in the game.
 * A note object may or may not be playable.
 *
 * ## Example
 *
 * If you have a BMS like this:
 *
 * ```
 * #00111:AA
 * ```
 *
 * Having parsed it using a {Compiler} into a {BMSChart},
 * you can create a {Notes} using `fromBMSChart()`:
 *
 * ```js
 * var notes = Notes.fromBMSChart(bmsChart)
 * ```
 *
 * Then you can get all notes using `.all()` method
 *
 * ```js
 * notes.all()
 * ```
 */
export declare class Notes {
    _notes: BMSNote[];
    static CHANNEL_MAPPING: typeof ChannelMapping;
    /**
     * @param {BMSNote[]} notes An array of Note objects
     */
    constructor(notes: BMSNote[]);
    /**
     * Returns the number of notes in this object,
     * counting both playable and non-playable notes.
     */
    count(): number;
    /**
     * Returns an Array of all notes.
     */
    all(): BMSNote[];
    /**
     * Creates a Notes object from a BMSChart.
     * @param chart the chart to process
     * @param options options
     */
    static fromBMSChart(chart: BMSChart, options?: BMSChartOptions): Notes;
}

/**
 * A Positioning represents the relation between song beats and
 * display position, and provides a way to convert between them.
 *
 * In some rhythm games, the amount of scrolling per beat may be different.
 * StepMania’s `#SCROLL` segments is an example.
 */
export declare class Positioning {
    _speedcore: Speedcore;
    /**
     * Constructs a Positioning from the given `segments`.
     * @param segments
     */
    constructor(segments: PositioningSegment[]);
    /**
     * Returns the scrolling speed at specified beat.
     * @param beat the beat number
     */
    speed(beat: number): number;
    /**
     * Returns the total elapsed scrolling amount at specified beat.
     * @param beat the beat number
     */
    position(beat: number): number;
    /**
     * Creates a {Positioning} object from the {BMSChart}.
     * @param {BMSChart} chart A {BMSChart} to construct a {Positioning} from
     */
    static fromBMSChart(chart: BMSChart): Positioning;
}

export declare interface PositioningSegment extends SpeedSegment {
    /** the beat number */
    t: number;
    /** the total elapsed amount of scrolling at beat `t` */
    x: number;
    /** the amount of scrolling per beat */
    dx: number;
    /** whether or not to include the
     starting beat `t` as part of the segment */
    inclusive: boolean;
}

/**
 * Reads the buffer, detect the character set, and returns the decoded
 * string synchronously.
 * @returns the decoded text
 */
declare function read(buffer: Buffer, options?: ReaderOptions | null): string;

/**
 * Like `read(buffer)`, but this is the asynchronous version.
 */
declare function readAsync(buffer: Buffer, options: ReaderOptions | null, callback?: ReadCallback): void;

/**
 * Like `read(buffer)`, but this is the asynchronous version.
 */
declare function readAsync(buffer: Buffer, callback?: ReadCallback): void;

export declare type ReadCallback = (error: Error | null, value?: string) => void;

declare namespace Reader {
    export {
        read,
        readAsync,
        getReaderOptionsFromFilename
    }
}
export { Reader }

export declare interface ReaderOptions {
    /** Force an encoding. */
    forceEncoding?: string;
}

/**
 * A SongInfo represents the song info, such as title, artist, genre.
 *
 * ## Example
 *
 * If you have a BMS like this:
 *
 * ```
 * #TITLE Exargon [HYPER]
 * ```
 *
 * Having parsed it using a {Compiler} into a {BMSChart},
 * you can create a {SongInfo} using `fromBMSChart()`:
 *
 * ```js
 * var info = SongInfo.fromBMSChart(bmsChart)
 * ```
 *
 * Then you can query the song information by accessing its properties.
 *
 * ```js
 * info.title     // => 'Exargon'
 * info.subtitles // => ['HYPER']
 * ```
 */
export declare class SongInfo implements ISongInfoData {
    title: string;
    artist: string;
    genre: string;
    subtitles: string[];
    subartists: string[];
    difficulty: number;
    level: number;
    /**
     * Constructs a SongInfo with given data
     * @param info the properties to set on this new instance
     */
    constructor(info: {
        [propertyName: string]: any;
    });
    /**
     * Constructs a new {SongInfo} object from a {BMSChart}.
     * @param chart A {BMSChart} to construct a {SongInfo} from
     */
    static fromBMSChart(chart: BMSChart): SongInfo;
}

/**
 * Public: A Spacing represents the relation between song beats and
 * notes spacing.
 *
 * In some rhythm games, such as Pump It Up!,
 * the speed (note spacing factor) may be adjusted by the notechart.
 * StepMania’s `#SPEED` segments is an example.
 */
export declare class Spacing {
    private _speedcore?;
    /**
     * Constructs a Spacing from the given `segments`.
     */
    constructor(segments: SpacingSegment[]);
    /**
     * Returns the note spacing factor at the specified beat.
     * @param beat the beat
     */
    factor(beat: number): number;
    /**
     * Creates a {Spacing} object from the {BMSChart}.
     *
     * ## `#SPEED` and `#xxxSP`
     *
     * Speed is defined as keyframes. These keyframes will be linearly interpolated.
     *
     * ```
     * #SPEED01 1.0
     * #SPEED02 2.0
     *
     * #001SP:01010202
     * ```
     *
     * In this example, the note spacing factor will gradually change
     * from 1.0x at beat 1 to 2.0x at beat 2.
     *
     * Returns a {Spacing} object
     *
     * @param {BMSChart} chart the chart
     */
    static fromBMSChart(chart: BMSChart): Spacing;
}

export declare interface SpacingSegment extends SpeedSegment {
    /** the beat number */
    t: number;
    /** the spacing at beat `t` */
    x: number;
    /**
     * the amount spacing factor change per beat,
     * in order to create a continuous speed change
     */
    dx: number;
    /**
     * whether or not to include the
     * starting beat `t` as part of the segment
     */
    inclusive: boolean;
}

/**
 * Speedcore is a small internally-used library.
 * A Speedcore represents a single dimensional keyframed linear motion
 * (as in equation x = f(t)), and is useful when working
 * with BPM changes ({Timing}), note spacing factor ({Spacing}), or scrolling
 * segments ({Positioning}).
 * A Speedcore is constructed from an array of Segments.
 *
 * A {Segment} is defined as `{ t, x, dx }`, such that:
 *
 * * speedcore.x(segment.t) = segment.x
 * * speedcore.t(segment.x) = segment.t
 * * speedcore.x(segment.t + dt) = segment.x + (segment.dx / dt)
 *
 *
 * ## Explanation
 *
 * One way to think of these segments is to think about tempo changes, where:
 *
 * * `t` is the elapsed time (in seconds) since song start.
 * * `x` is the elapsed beat since song start.
 * * `dx` is the amount of `x` increase per `t`. In this case, it has the
 *   unit of beats per second.
 *
 * For example, consider a song that starts at 140 BPM.
 * 32 beats later, the tempo changes to 160 BPM.
 * 128 beats later (at beat 160), the tempo reverts to 140 BPM.
 *
 * We can derive three segments:
 *
 * 1. At time 0, we are at beat 0, and moving at 2.333 beats per second.
 * 2. At 13.714s, we are at beat 32, moving at 2.667 beats per second.
 * 3. At 61.714s, we are at beat 160, moving at 2.333 beats per second.
 *
 * This maps out to this data structure:
 *
 * ```js
 * [ [0]: { t:  0.000,  x:   0,  dx: 2.333,  inclusive: true },
 *   [1]: { t: 13.714,  x:  32,  dx: 2.667,  inclusive: true },
 *   [2]: { t: 61.714,  x: 160,  dx: 2.333,  inclusive: true } ]
 * ```
 *
 * With this data, it is possible to find out the value of `x` at any given `t`.
 *
 * For example, to answer the question, “what is the beat number at 30s?”
 * First, we find the segment with maximum value of `t < 30`, and we get
 * the segment `[1]`.
 *
 * We calculate `segment.x + (t - segment.t) * segment.dx`.
 * The result beat number is (32 + (30 - 13.714) * 2.667) = 75.435.
 *
 * We can also perform the reverse calculation in a similar way, by reversing
 * the equation.
 *
 * Interestingly, we can use these segments to represent the effect of
 * both BPM changes and STOP segments in the same array.
 * For example, a 150-BPM song with a 2-beat stop in the 32nd beat
 * can be represented like this:
 *
 * ```js
 * [ [0]: { t:  0.0,  x:  0,  dx: 2.5,  inclusive: true  },
 *   [1]: { t: 12.8,  x: 32,  dx: 0,    inclusive: true  },
 *   [2]: { t: 13.6,  x: 32,  dx: 2.5,  inclusive: false } ]
 * ```
 */
export declare class Speedcore<S extends SpeedSegment = SpeedSegment> {
    _segments: S[];
    /**
     * Constructs a new `Speedcore` from given segments.
     */
    constructor(segments: S[]);
    _reached(index: number, targetFn: (segment: S) => number, position: number): boolean;
    _segmentAt(targetFn: (segment: S) => number, position: number): S;
    segmentAtX(x: number): S;
    segmentAtT(t: number): S;
    /**
     * Calculates the _t_, given _x_.
     */
    t(x: number): number;
    /**
     * Calculates the _x_, given _t_.
     * @param {number} t
     */
    x(t: number): number;
    /**
     * Finds the _dx_, given _t_.
     * @param {number} t
     */
    dx(t: number): number;
}

declare interface SpeedSegment {
    t: number;
    x: number;
    /** the amount of change in x per t */
    dx: number;
    /** whether or not the segment includes the t */
    inclusive: boolean;
}

export declare interface StopTimingAction extends BaseTimingAction {
    type: 'stop';
    /** number of beats to stop */
    stopBeats: number;
}

/**
 * A TimeSignatures is a collection of time signature values
 * index by measure number.
 *
 * The measure number starts from 0.
 * By default, each measure has a measure size of 1
 * (which represents the common 4/4 time signature)
 *
 * ## Example
 *
 * If you have a BMS like this:
 *
 * ```
 * #00102:0.75
 * #00103:1.25
 * ```
 *
 * Having parsed it using a {Compiler} into a {BMSChart},
 * you can access the {TimeSignatures} object:
 *
 * ```js
 * var timeSignatures = bmsChart.timeSignatures
 * ```
 *
 * Note that you can also use the constructor
 * to create a {TimeSignatures} from scratch.
 *
 * One of the most useful use case of this class
 * is to convert the measure and fraction into beat number.
 *
 * ```js
 * timeSignatures.measureToBeat(0, 0.000) // =>  0.0
 * timeSignatures.measureToBeat(0, 0.500) // =>  2.0
 * timeSignatures.measureToBeat(1, 0.000) // =>  4.0
 * timeSignatures.measureToBeat(1, 0.500) // =>  5.5
 * timeSignatures.measureToBeat(2, 0.000) // =>  7.0
 * timeSignatures.measureToBeat(2, 0.500) // =>  9.5
 * timeSignatures.measureToBeat(3, 0.000) // => 12.0
 * ```
 */
export declare class TimeSignatures {
    private _values;
    constructor();
    /**
     * Sets the size of a specified measure.
     * @param measure the measure number, starting from 0
     * @param value the measure size.
     *  For example, a size of 1.0 represents a common 4/4 time signature,
     *  whereas a size of 0.75 represents the 3/4 or 6/8 time signature.
     */
    set(measure: number, value: number): void;
    /**
     * Retrieves the size of a specified measure.
     * @param measure representing the measure number.
     * @returns the size of the measure.
     *  By default, a measure has a size of 1.
     */
    get(measure: number): number;
    /**
     * Retrieves the number of beats in a specified measure.
     *
     * Since one beat is equivalent to a quarter note in 4/4 time signature,
     * this is equivalent to `(timeSignatures.get(measure) * 4)`.
     * @param measure representing the measure number.
     * @returns the size of the measure in beats.
     */
    getBeats(measure: number): number;
    /**
     * Converts a measure number and a fraction inside that measure
     * into the beat number.
     *
     * @param measure the measure number.
     * @param fraction the fraction of a measure,
     * @returns the number of beats since measure 0.
     */
    measureToBeat(measure: number, fraction: number): number;
}

/**
 * A Timing represents the timing information of a musical score.
 * A Timing object provides facilities to synchronize between
 * metric time (seconds) and musical time (beats).
 *
 * A Timing are created from a series of actions:
 *
 * - BPM changes.
 * - STOP action.
 */
export declare class Timing {
    _speedcore: Speedcore<TimingSegment>;
    _eventBeats: number[];
    /**
     * Constructs a Timing with an initial BPM and specified actions.
     *
     * Generally, you would use `Timing.fromBMSChart` to create an instance
     * from a BMSChart, but the constructor may also be used in other situations
     * unrelated to the BMS file format. (e.g. bmson package)
     */
    constructor(initialBPM: number, actions: TimingAction[]);
    /**
     * Convert the given beat into seconds.
     * @param {number} beat
     */
    beatToSeconds(beat: number): number;
    /**
     * Convert the given second into beats.
     * @param {number} seconds
     */
    secondsToBeat(seconds: number): number;
    /**
     * Returns the BPM at the specified beat.
     * @param {number} beat
     */
    bpmAtBeat(beat: number): number;
    /**
     * Returns an array representing the beats where there are events.
     */
    getEventBeats(): number[];
    /**
     * Creates a Timing instance from a BMSChart.
     * @param {BMSChart} chart
     */
    static fromBMSChart(chart: BMSChart): Timing;
}

export declare type TimingAction = BPMTimingAction | StopTimingAction;

declare interface TimingSegment extends SpeedSegment {
    bpm: number;
}

export { }
