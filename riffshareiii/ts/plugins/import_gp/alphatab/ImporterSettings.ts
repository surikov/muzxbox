/**
 * All settings related to importers that decode file formats.
 * @json
 */
 class ImporterSettings {
    /**
     * The text encoding to use when decoding strings. By default UTF-8 is used.
     */
    public encoding: string = 'utf-8';

    /**
     * If part-groups should be merged into a single track.
     */
    public mergePartGroupsInMusicXml: boolean = false;

    /**
     * If set to true, text annotations on beats are attempted to be parsed as
     * lyrics considering spaces as separators and removing underscores.
     * If a track/staff has explicit lyrics the beat texts will not be detected as lyrics. 
     */
    public beatTextAsLyrics: boolean = false;
}
 enum TextAlign {
    /**
     * Text is left aligned.
     */
    Left,
    /**
     * Text is centered.
     */ Center,
    /**
     * Text is right aligned.
     */ Right
}

/**
 * This public enum lists all base line modes
 */
 enum TextBaseline {
    /**
     * Text is aligned on top.
     */
    Top,
    /**
     * Text is aligned middle
     */
    Middle,
    /**
     * Text is aligend on the bottom.
     */
    Bottom
}